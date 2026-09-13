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
        
        // Newly registered users won't have a role/department mapped yet
        return CreateResponse(user, "Unknown", null);
    }

    public async Task<AuthResponse> LoginAsync(
    LoginRequest request,
    CancellationToken cancellationToken)
{
    // 1. Find the user in the Users table
    var user = await dbContext.Users
        .SingleOrDefaultAsync(
            u => u.User_Name == request.UserName,
            cancellationToken);

    // 2. Verify username + password
    if (user is null ||
        passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            request.Password) == PasswordVerificationResult.Failed)
    {
        throw new UnauthorizedAccessException(
            "Invalid username or password.");
    }

    string role = "Unknown";
    string? departmentName = null;

    // =====================================================
    // 3. CHECK BUSINESS OWNER
    // =====================================================

    var isBO = await dbContext.BOs
        .AnyAsync(
            b => b.User_ID == user.User_ID,
            cancellationToken);

    if (isBO)
    {
        role = "BO";
    }
    else
    {
        // =================================================
        // 4. CHECK RESOURCE PLANNER
        // =================================================

        var isResourcePlanner = await dbContext.Resource_Planner
            .AnyAsync(
                p => p.User_ID == user.User_ID,
                cancellationToken);

        if (isResourcePlanner)
        {
            role = "ResourcePlanner";
        }
        else
        {
            // =============================================
            // 5. CHECK EMPLOYEE
            // =============================================

            var employee = await dbContext.Employees
                .Include(e => e.Department)
                .FirstOrDefaultAsync(
                    e => e.User_ID == user.User_ID,
                    cancellationToken);

            if (employee != null)
            {
                departmentName = employee.Department?.D_Name;

                // =========================================
                // 6. DETERMINE EMPLOYEE TRACK FROM TITLE
                // =========================================

                if (string.Equals(
                        employee.Title,
                        "Head of Product Owner",
                        StringComparison.OrdinalIgnoreCase))
                {
                    role = "HeadOfPO";
                }
                else if (!string.IsNullOrWhiteSpace(employee.Title) &&
                         employee.Title.StartsWith(
                             "Head of ",
                             StringComparison.OrdinalIgnoreCase))
                {
                    role = "Head";
                }
                else if (string.Equals(
                             employee.Title,
                             "Employee",
                             StringComparison.OrdinalIgnoreCase))
                {
                    role = "Employee";
                }
                else
                {
                    // Employee exists but we don't know
                    // which dashboard this employee belongs to.
                    role = "Unknown";
                }
            }
        }
    }

    // =====================================================
    // 7. RETURN TOKEN + ROLE
    // =====================================================

    return CreateResponse(
        user,
        role,
        departmentName);
}

    private AuthResponse CreateResponse(User user, string role, string? departmentName)
    {
        var key = configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is not configured.");
        
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.User_ID.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.User_ID.ToString()),
            new Claim(ClaimTypes.Name, user.User_Name ?? string.Empty),
            new Claim(ClaimTypes.Role, role)
        };

        // Inject the Department as a claim if it exists
        if (!string.IsNullOrWhiteSpace(departmentName))
        {
            claims.Add(new Claim("Department", departmentName));
        }

        var credentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256);
        
        var token = new JwtSecurityToken(
            configuration["Jwt:Issuer"], 
            configuration["Jwt:Audience"], 
            claims,
            expires: DateTime.UtcNow.AddHours(8), 
            signingCredentials: credentials);
            
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