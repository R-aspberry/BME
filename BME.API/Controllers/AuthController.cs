using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BME.API.DTOs;
using BME.API.Services.Interfaces;

namespace BME.API.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(IAuthService authService) : ControllerBase
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
    public ActionResult<MeResponse> Me()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdValue, out var userId)) return Unauthorized();

        return Ok(new MeResponse(userId,
            User.FindFirstValue(ClaimTypes.Name) ?? string.Empty,
            User.FindFirstValue(ClaimTypes.Role) ?? "Employee"));
    }
}