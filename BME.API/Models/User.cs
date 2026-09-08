namespace BME.API.Models;

public class User
{
    public int User_ID { get; set; }
    public string? User_Name { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public ICollection<ResourcePlanner> ResourcePlanners { get; set; } = new List<ResourcePlanner>();
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    public ICollection<BO> BusinessOwners { get; set; } = new List<BO>();
}