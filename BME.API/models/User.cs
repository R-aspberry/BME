using System;
using System.Collections.Generic;

namespace BME.Backend.Models;

public partial class User
{
    public int UserId { get; set; }

    public string? UserName { get; set; }

    public string PasswordHash { get; set; } = null!;

    public virtual ICollection<Bo> Bos { get; set; } = new List<Bo>();

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();

    public virtual ICollection<Ose> Oses { get; set; } = new List<Ose>();

    public virtual ICollection<ResourcePlanner> ResourcePlanners { get; set; } = new List<ResourcePlanner>();
}
