namespace BME.API.Models;

public class User
{
    public int User_ID { get; set; }

    public string? User_Name { get; set; }

    public string PasswordHash { get; set; } = string.Empty;
}