namespace BME.API.Models;

public class ResourcePlanner
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public int ProjectId { get; set; }
    public DateTime WeekStart { get; set; }
    public decimal AllocationPercent { get; set; }
    public string? Notes { get; set; }

    public Employee Employee { get; set; } = null!;
    public Project Project { get; set; } = null!;
}
