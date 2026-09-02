namespace BME.API.DTOs;

public class ProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = "Planned";
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
