namespace BME.API.Models;

public class OSE 
{
    public int OSE_ID { get; set; }

    public string? FN { get; set; }

    public string? LN { get; set; }

    public int? Age { get; set; }

    public string? Skills { get; set; }

    public string? Title { get; set; }

    public string? Vendor { get; set; }

    public string? Email { get; set; }

    public string? Status { get; set; }

    public int Planner_ID { get; set;}

    public int Interviewer_ID { get; set;}

    public ResourcePlanner? Planner { get; set; }

    public Employee? Interviewer { get; set; }

    public int? User_ID { get; set; }

    public User? User { get; set; }

    public int EMP_ID { get; set; }

    public string? Phone { get; set; }

    public Employee? Employee { get; set; }

}