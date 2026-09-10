namespace BME.API.DTOs;

public sealed record NotificationDto(int ProjectId, string Message, string? Level);
