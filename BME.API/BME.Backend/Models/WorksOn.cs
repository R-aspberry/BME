using System;
using System.Collections.Generic;

namespace BME.Backend.Models;

public partial class WorksOn
{
    public int EmployeeId { get; set; }

    public int PrjId { get; set; }

    public virtual Project Prj { get; set; } = null!;
}
