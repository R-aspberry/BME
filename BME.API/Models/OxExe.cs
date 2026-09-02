namespace BME.API.Models;

public class OxExe
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int ProjectId { get; set; }
    public int DepartmentId { get; set; }

    public Project Project { get; set; } = null!;
    public Department Department { get; set; } = null!;
}
