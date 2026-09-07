namespace BME.Backend.DTOs;

public class BusinessOwnerDto
{
    public int BoId { get; set; }
    public string? Name { get; set; }
    public string? BusinessArea { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public int? UserId { get; set; }
}