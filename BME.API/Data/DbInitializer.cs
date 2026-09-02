using BME.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BME.API.Data;

public static class DbInitializer
{
    public static void Initialize(ResourceAllocationDbContext context)
    {
        context.Database.EnsureCreated();

        if (context.Departments.Any())
        {
            return;
        }

        var departments = new[]
        {
            new Department { Name = "Engineering", Description = "Core engineering team" },
            new Department { Name = "Operations", Description = "Operational support" },
            new Department { Name = "Human Resources", Description = "People support" }
        };

        context.Departments.AddRange(departments);
        context.SaveChanges();

        var projects = new[]
        {
            new Project
            {
                Name = "HRIS Modernization",
                Description = "Project for optimizing HR workflows",
                Status = "In Progress",
                StartDate = DateTime.Today.AddDays(-15),
            },
            new Project
            {
                Name = "Merl System Upgrade",
                Description = "Upgrade and stabilization project",
                Status = "Planned",
                StartDate = DateTime.Today.AddDays(10),
            }
        };

        context.Projects.AddRange(projects);
        context.SaveChanges();

        var employees = new[]
        {
            new Employee { FirstName = "Sara", LastName = "Ali", Email = "sara.ali@company.com", Role = "Project Manager", DepartmentId = departments[0].Id },
            new Employee { FirstName = "Yousef", LastName = "Khaled", Email = "yousef.khaled@company.com", Role = "Developer", DepartmentId = departments[0].Id },
            new Employee { FirstName = "Nadia", LastName = "Saleh", Email = "nadia.saleh@company.com", Role = "Operations Lead", DepartmentId = departments[1].Id }
        };

        context.Employees.AddRange(employees);
        context.SaveChanges();

        context.ResourcePlanners.AddRange(
            new ResourcePlanner
            {
                EmployeeId = employees[0].Id,
                ProjectId = projects[0].Id,
                WeekStart = DateTime.Today,
                AllocationPercent = 80,
                Notes = "Primary owner"
            },
            new ResourcePlanner
            {
                EmployeeId = employees[1].Id,
                ProjectId = projects[0].Id,
                WeekStart = DateTime.Today,
                AllocationPercent = 60,
                Notes = "Development support"
            }
        );

        context.OseItems.AddRange(
            new OSE { Name = "People Tracker", Description = "Employee monitoring dashboard", ProjectId = projects[0].Id, DepartmentId = departments[0].Id, Status = "Active" },
            new OSE { Name = "Operations Tracker", Description = "Operational workflow visibility", ProjectId = projects[1].Id, DepartmentId = departments[1].Id, Status = "Planned" }
        );

        context.BusinessObjectives.AddRange(
            new BO { Title = "Improve reporting", Description = "Deliver better reporting visibility", ProjectId = projects[0].Id },
            new BO { Title = "Reduce downtime", Description = "Reduce system downtime and delays", ProjectId = projects[1].Id }
        );

        context.SaveChanges();
    }
}
