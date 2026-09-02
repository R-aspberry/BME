namespace BME.API.DTOs;

public class ResourcePlannerDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public int ProjectId { get; set; }
    public DateTime WeekStart { get; set; }
    public decimal AllocationPercent { get; set; }
    public string? Notes { get; set; }
}
