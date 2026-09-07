namespace BME.API.DTOs;

public class UpdateProjectDto
{
    public int Prj_ID { get; set; }

    public string? Project_Name { get; set; }

    public string? Flag { get; set; }

    public string? Status { get; set; }

    public string? Description { get; set; }

    public decimal? Budget { get; set; }

    public string? MVP { get; set; }

    public string? BRD { get; set; }

    public DateTime? Start_date { get; set; }

    public DateTime? End_date { get; set; }

    public int? BO_ID { get; set; }
}