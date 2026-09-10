namespace BME.API.DTOs;

public class CreateStaffingRequestDto
{
    public string Department { get; set; } = string.Empty;
    public int Required_Count { get; set; }
    public string? Details { get; set; }
    public int? Planner_ID { get; set; }
}

public class UpdateStaffingRequestStatusDto
{
    public string Status { get; set; } = string.Empty;
}

public class StaffingRequestDto
{
    public int Request_ID { get; set; }
    public string Department { get; set; } = string.Empty;
    public int Required_Count { get; set; }
    public string? Details { get; set; }
    public string Status { get; set; } = string.Empty;
    public int? Planner_ID { get; set; }
    public DateTime Created_At { get; set; }
}
