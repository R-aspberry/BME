using System;
using System.Collections.Generic;

namespace BME.Backend.Models;

public partial class Employee
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public string? Fn { get; set; }

    public string? Ln { get; set; }

    public string? Title { get; set; }

    public DateOnly? Dob { get; set; }

    public DateOnly? HiredDate { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? VendorName { get; set; }

    public int? YearsOfExperience { get; set; }

    public bool? IsOse { get; set; }

    public int? OseId { get; set; }

    public int? ManagerId { get; set; }

    public int? DId { get; set; }

    public int? TypeOfContractId { get; set; }

    public virtual Department? DIdNavigation { get; set; }

    public virtual ICollection<Employee> InverseManager { get; set; } = new List<Employee>();

    public virtual Employee? Manager { get; set; }

    public virtual ICollection<Ose> OseEmps { get; set; } = new List<Ose>();

    public virtual ICollection<Ose> OseInterviewers { get; set; } = new List<Ose>();

    public virtual User? User { get; set; }

    public virtual ICollection<Project> Prjs { get; set; } = new List<Project>();
}
