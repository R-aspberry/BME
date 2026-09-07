namespace BME.API.DTOs;

public class CreateDepartmentDto
{
    public int D_ID { get; set; }
    public string? D_Name { get; set; }
    public int? Availability { get; set; }
}