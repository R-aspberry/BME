namespace BME.API.Models;

public class Department
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    public ICollection<OSE> OseItems { get; set; } = new List<OSE>();
    public ICollection<OxExe> OxExes { get; set; } = new List<OxExe>();
}
