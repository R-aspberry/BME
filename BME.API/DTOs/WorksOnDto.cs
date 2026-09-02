namespace BME.API.DTOs;

public class WorksOnDto
{
    public int EmployeeId { get; set; }
    public int ProjectId { get; set; }
    public string Role { get; set; } = string.Empty;
    public decimal AllocationPercent { get; set; }
}
