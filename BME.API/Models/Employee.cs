namespace BME.API.Models;

public class Employee
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int DepartmentId { get; set; }

    public Department Department { get; set; } = null!;
    public ICollection<WorksOn> WorksOn { get; set; } = new List<WorksOn>();
    public ICollection<ResourcePlanner> ResourcePlanners { get; set; } = new List<ResourcePlanner>();
}
