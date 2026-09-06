using Microsoft.EntityFrameworkCore;
using BME.API.Models;

namespace BME.API.Data;

public class BMEDbContext : DbContext
{
    public BMEDbContext(DbContextOptions<BMEDbContext> options)
    : base(options)
    {
    }   

    public DbSet<User> Users { get; set; }
    public DbSet<Department> Department { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<OSE> OSE { get; set; }
    public ResourcePlanner? Planner { get; set; }
    public Employee? Interviewer { get; set; }
    

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
    modelBuilder.Entity<User>()
            .HasKey(u => u.User_ID);

    modelBuilder.Entity<Department>()
            .HasKey(d => d.D_ID);

    modelBuilder.Entity<Employee>()
            .HasKey(e => e.ID);

    modelBuilder.Entity<OSE>()
            .HasKey(e => e.OSE_ID);

    modelBuilder.Entity<Employee>()
        .HasOne(e => e.Department)
        .WithMany(d => d.Employees)
        .HasForeignKey(e => e.D_ID);
    
    modelBuilder.Entity<OSE>()
        .HasOne(e => e.Planner)
        .WithOne()
        .HasForeignKey<OSE>(e => e.Planner_ID);

    modelBuilder.Entity<OSE>()
        .HasOne(e => e.Interviewer)
        .WithOne()
        .HasForeignKey<OSE>(e => e.Interviewer_ID);

        }
}