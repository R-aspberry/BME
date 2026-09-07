namespace BME.API.DTOs;

public class CreateBODto
{
    public int BO_ID { get; set; }

    public string? Name { get; set; }

    public string? Business_Area { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public int? User_ID { get; set; }
}