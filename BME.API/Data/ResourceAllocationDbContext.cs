using BME.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BME.API.Data;

public class ResourceAllocationDbContext : DbContext
{
    public ResourceAllocationDbContext(DbContextOptions<ResourceAllocationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<OSE> OseItems => Set<OSE>();
    public DbSet<ResourcePlanner> ResourcePlanners => Set<ResourcePlanner>();
    public DbSet<BO> BusinessObjectives => Set<BO>();
    public DbSet<WorksOn> WorksOn => Set<WorksOn>();
    public DbSet<OxExe> OxExes => Set<OxExe>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<WorksOn>()
            .HasKey(w => new { w.EmployeeId, w.ProjectId });

        modelBuilder.Entity<WorksOn>()
            .HasOne(w => w.Employee)
            .WithMany(e => e.WorksOn)
            .HasForeignKey(w => w.EmployeeId);

        modelBuilder.Entity<WorksOn>()
            .HasOne(w => w.Project)
            .WithMany(p => p.WorksOn)
            .HasForeignKey(w => w.ProjectId);

        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Department)
            .WithMany(d => d.Employees)
            .HasForeignKey(e => e.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Project>()
            .HasMany(p => p.WorksOn)
            .WithOne(w => w.Project)
            .HasForeignKey(w => w.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Project>()
            .HasMany(p => p.ResourcePlanners)
            .WithOne(r => r.Project)
            .HasForeignKey(r => r.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Employee>()
            .HasMany(e => e.ResourcePlanners)
            .WithOne(r => r.Employee)
            .HasForeignKey(r => r.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Project>()
            .HasMany(p => p.OseItems)
            .WithOne(o => o.Project)
            .HasForeignKey(o => o.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Department>()
            .HasMany(d => d.OseItems)
            .WithOne(o => o.Department)
            .HasForeignKey(o => o.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Project>()
            .HasMany(p => p.BusinessObjectives)
            .WithOne(b => b.Project)
            .HasForeignKey(b => b.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Project>()
            .HasMany(p => p.OxExes)
            .WithOne(o => o.Project)
            .HasForeignKey(o => o.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Department>()
            .HasMany(d => d.OxExes)
            .WithOne(o => o.Department)
            .HasForeignKey(o => o.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        base.OnModelCreating(modelBuilder);
    }
}
