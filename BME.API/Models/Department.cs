namespace BME.API.Models;
using System.Collections.Generic;

public class Department
{
    public int D_ID { get; set; }
    public string? D_Name { get; set; }
    public int Availability { get; set; }
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();

}