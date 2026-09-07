namespace MERL.API.DTOs;

public sealed record RegisterRequest(string UserName, string Password);
public sealed record LoginRequest(string UserName, string Password);
public sealed record AuthResponse(string Token, int UserId, int? EmployeeId, string? Email, string Role);
public sealed record MeResponse(int UserId, int? EmployeeId, string? Email, string Role, string? FirstName, string? LastName);