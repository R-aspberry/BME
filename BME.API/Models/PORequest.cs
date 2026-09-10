namespace BME.API.Models;

public class PORequest
{
    public int Request_ID { get; set; }
    public string Department { get; set; } = string.Empty;
    public int Required_Count { get; set; }
    public string? Details { get; set; }
    public string Status { get; set; } = "Pending";
    public int? Planner_ID { get; set; }
    public DateTime Created_At { get; set; } = DateTime.UtcNow;
}
