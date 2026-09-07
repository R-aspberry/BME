using System;
using System.Collections.Generic;

namespace BME.Backend.Models;

public partial class ResourcePlanner
{
    public int PlannerId { get; set; }

    public string? Name { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public int? UserId { get; set; }

    public virtual ICollection<Ose> Oses { get; set; } = new List<Ose>();

    public virtual User? User { get; set; }
}
