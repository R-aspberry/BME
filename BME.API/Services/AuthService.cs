using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using BME.API.Data;
using BME.API.DTOs;
using BME.API.Models;
using BME.API.Services.Interfaces;

namespace BME.API.Services;

public sealed class AuthService(
    BMEDbContext dbContext,
    IPasswordHasher<User> passwordHasher,
    IConfiguration configuration) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        ValidateUserName(request.UserName);
        ValidatePassword(request.Password);
        if (await dbContext.Users.AnyAsync(u => u.User_Name == request.UserName, cancellationToken))
            throw new InvalidOperationException("This username is already in use.");

        var nextUserId = (await dbContext.Users.MaxAsync(user => (int?)user.User_ID, cancellationToken) ?? 0) + 1;
        var user = new User { User_ID = nextUserId, User_Name = request.UserName };
        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken);
        return CreateResponse(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users
            .Include(item => item.ResourcePlanners)
            .SingleOrDefaultAsync(item => item.User_Name == request.UserName, cancellationToken);
        if (user is null || passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
            throw new UnauthorizedAccessException("Invalid username or password.");

        return CreateResponse(user);
    }

    private AuthResponse CreateResponse(User user)
    {
        var key = configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is not configured.");
        var role = user.ResourcePlanners.Count > 0 ? "Resource Planner" : "Employee";
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.User_ID.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.User_ID.ToString()),
            new Claim(ClaimTypes.Name, user.User_Name ?? string.Empty),
            new Claim(ClaimTypes.Role, role)
        };
        var credentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(configuration["Jwt:Issuer"], configuration["Jwt:Audience"], claims,
            expires: DateTime.UtcNow.AddHours(8), signingCredentials: credentials);
        return new AuthResponse(new JwtSecurityTokenHandler().WriteToken(token), user.User_ID, user.User_Name ?? string.Empty, role);
    }

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