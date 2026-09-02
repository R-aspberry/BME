namespace BME.API.DTOs;

public class OxExeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int ProjectId { get; set; }
    public int DepartmentId { get; set; }
}
