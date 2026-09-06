namespace BME.API.Models;

public class Employee
{
    public int ID { get; set; }

    public int? User_ID { get; set; }

    public string? FN { get; set; }

    public string? LN { get; set; }

    public string? Title { get; set; }

    public DateTime? DOB { get; set; }

    public DateTime? Hired_Date { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? Vendor_Name { get; set; }

    public int? Years_OF_Experience { get; set; }

    public bool? Is_OSE { get; set; }

    public int? OSE_ID { get; set; }

    public int? Manager_ID { get; set; }

    public int? D_ID { get; set; }

    public int? Type_of_contract_ID { get; set; }

    public Department? Department { get; set; }

    public User? User { get; set; }
}