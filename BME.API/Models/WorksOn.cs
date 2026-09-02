namespace BME.API.Models;

public class WorksOn
{
    public int EmployeeId { get; set; }
    public int ProjectId { get; set; }
    public string Role { get; set; } = string.Empty;
    public decimal AllocationPercent { get; set; }

    public Employee Employee { get; set; } = null!;
    public Project Project { get; set; } = null!;
}
