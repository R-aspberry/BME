namespace BME.API.DTOs;

public sealed record RegisterRequest(string UserName, string Password);
public sealed record LoginRequest(string UserName, string Password);
public sealed record AuthResponse(string Token, int UserId, string UserName, string Role);
public sealed record MeResponse(int UserId, string UserName, string Role);