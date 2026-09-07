using System;
using System.Collections.Generic;

namespace BME.Backend.Models;

public partial class Bo
{
    public int BoId { get; set; }

    public string? Name { get; set; }

    public string? BusinessArea { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public int? UserId { get; set; }

    public virtual ICollection<Project> Projects { get; set; } = new List<Project>();

    public virtual User? User { get; set; }
}
