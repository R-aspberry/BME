namespace BME.API.Models;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = "Planned";
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public ICollection<WorksOn> WorksOn { get; set; } = new List<WorksOn>();
    public ICollection<OSE> OseItems { get; set; } = new List<OSE>();
    public ICollection<ResourcePlanner> ResourcePlanners { get; set; } = new List<ResourcePlanner>();
    public ICollection<BO> BusinessObjectives { get; set; } = new List<BO>();
    public ICollection<OxExe> OxExes { get; set; } = new List<OxExe>();
}
