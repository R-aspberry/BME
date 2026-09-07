namespace BME.API.DTOs;

public class CreateUserDto
{
    public int User_ID { get; set; }
    public string? User_Name { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
}