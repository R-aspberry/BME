namespace BME.API.Models;

public class ResourcePlanner
{
    public int Planner_ID { get; set; }

    public string? Name { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public int ? User_ID { get; set; }

    public User? User { get; set; }
}