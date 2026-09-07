using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MERL.API.Data;
using MERL.API.DTOs;
using MERL.API.Services.Interfaces;

namespace MERL.API.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(IAuthService authService, ResourceAllocationDbContext dbContext) : ControllerBase
{
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        try
        {
            return Ok(await authService.RegisterAsync(request, cancellationToken));
        }
        catch (ArgumentException exception) { return BadRequest(new { message = exception.Message }); }
        catch (InvalidOperationException exception) { return Conflict(new { message = exception.Message }); }
        catch (UnauthorizedAccessException exception) { return StatusCode(StatusCodes.Status403Forbidden, new { message = exception.Message }); }
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        try
        {
            return Ok(await authService.LoginAsync(request, cancellationToken));
        }
        catch (UnauthorizedAccessException exception) { return Unauthorized(new { message = exception.Message }); }
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<MeResponse>> Me(CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdValue, out var userId)) return Unauthorized();

        var user = await dbContext.Users
            .Include(item => item.Employees)
            .SingleOrDefaultAsync(item => item.UserId == userId, cancellationToken);
        if (user is null) return Unauthorized();

        var employee = user.Employees.FirstOrDefault();
        return Ok(new MeResponse(user.UserId, employee?.Id, employee?.Email,
            User.FindFirstValue(ClaimTypes.Role) ?? "Employee", employee?.FirstName, employee?.LastName));
    }
}