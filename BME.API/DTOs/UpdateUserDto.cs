namespace BME.API.DTOs;

public class UpdateUserDto
{
    public string? User_Name { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
}