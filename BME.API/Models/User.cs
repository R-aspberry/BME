namespace MERL.API.Models;

public class User
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    public ICollection<BusinessOwner> BusinessOwners { get; set; } = new List<BusinessOwner>();
    public ICollection<ResourcePlanner> ResourcePlanners { get; set; } = new List<ResourcePlanner>();
}