using System;
using System.Collections.Generic;

namespace BME.Backend.Models;

public partial class Ose
{
    public int OseId { get; set; }

    public string? Fn { get; set; }

    public string? Ln { get; set; }

    public string? Vendor { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? Status { get; set; }

    public int? PlannerId { get; set; }

    public int? InterviewerId { get; set; }

    public int? UserId { get; set; }

    public int? EmpId { get; set; }

    public virtual Employee? Emp { get; set; }

    public virtual Employee? Interviewer { get; set; }

    public virtual ResourcePlanner? Planner { get; set; }

    public virtual User? User { get; set; }
}
