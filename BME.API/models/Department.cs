using System;
using System.Collections.Generic;

namespace BME.Backend.Models;

public partial class Department
{
    public int DId { get; set; }

    public string? DName { get; set; }

    public int? Availability { get; set; }

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
