using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MERL.API.Data;
using MERL.API.DTOs;
using MERL.API.Models;
using MERL.API.Services.Interfaces;

namespace MERL.API.Services;

public sealed class AuthService(
    ResourceAllocationDbContext dbContext,
    IPasswordHasher<User> passwordHasher,
    IConfiguration configuration) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        ValidateUserName(request.UserName);
        ValidatePassword(request.Password);
        if (await dbContext.Users.AnyAsync(u => u.UserName == request.UserName, cancellationToken))
            throw new InvalidOperationException("This username is already in use.");

        var nextUserId = (await dbContext.Users.MaxAsync(user => (int?)user.UserId, cancellationToken) ?? 0) + 1;
        var user = new User { UserId = nextUserId, UserName = request.UserName };
        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken);
        return CreateResponse(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await LoadUserAsync(request.UserName, cancellationToken);
        if (user is null || passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
            throw new UnauthorizedAccessException("Invalid username or password.");

        return CreateResponse(user);
    }

    private async Task<User?> LoadUserAsync(string userName, CancellationToken cancellationToken) =>
        await dbContext.Users
            .Include(user => user.Employees)
            .Include(user => user.BusinessOwners)
            .Include(user => user.ResourcePlanners)
            .SingleOrDefaultAsync(user => user.UserName == userName, cancellationToken);

    private AuthResponse CreateResponse(User user)
    {
        var key = configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is not configured.");
        var employee = user.Employees.FirstOrDefault();
        var role = GetRole(user, employee);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Role, role)
        };
        if (employee is not null) claims = [.. claims, new Claim(ClaimTypes.Email, employee.Email)];
        var credentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(configuration["Jwt:Issuer"], configuration["Jwt:Audience"], claims,
            expires: DateTime.UtcNow.AddHours(8), signingCredentials: credentials);
        return new AuthResponse(new JwtSecurityTokenHandler().WriteToken(token), user.UserId, employee?.Id, employee?.Email, role);
    }

    private static string GetRole(User user, Employee? employee) =>
        user.ResourcePlanners.Count > 0 ? "Resource Planner" :
        user.BusinessOwners.Count > 0 ? "Business Owner" :
        employee?.Title.StartsWith("Head of", StringComparison.OrdinalIgnoreCase) == true ? "Manager" : "Employee";

    private static void ValidateUserName(string userName)
    {
        if (string.IsNullOrWhiteSpace(userName) || userName.Length > 50)
            throw new ArgumentException("Username is required and must be 50 characters or fewer.");
    }

    private static void ValidatePassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
            throw new ArgumentException("Password must be at least 8 characters long.");
    }
}