using System;
using System.Collections.Generic;

namespace BME.Backend.Models;

public partial class Project
{
    public int PrjId { get; set; }

    public string? ProjectName { get; set; }

    public string? Flag { get; set; }

    public string? Status { get; set; }

    public string? Description { get; set; }

    public decimal? Budget { get; set; }

    public string? Mvp { get; set; }

    public string? Brd { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public int? BoId { get; set; }

    public virtual Bo? Bo { get; set; }

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
