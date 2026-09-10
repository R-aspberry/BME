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
    public DbSet<Department> Departments { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<OSE> OSE { get; set; }
    public DbSet<ResourcePlanner> Resource_Planner { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<BO> BOs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // =========================
        // User
        // =========================
        modelBuilder.Entity<User>()
            .HasKey(u => u.User_ID);


        // =========================
        // Department
        // =========================
        modelBuilder.Entity<Department>(entity =>
        {
            entity.ToTable("Department");
            entity.HasKey(d => d.D_ID);
        });


        // =========================
        // Employee
        // =========================
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.ID);
            entity.ToTable("Employees");

            entity.Property(e => e.ID).HasColumnName("ID");
            entity.Property(e => e.User_ID).HasColumnName("User_ID");
            entity.Property(e => e.FN).HasColumnName("FN");
            entity.Property(e => e.LN).HasColumnName("LN");
            entity.Property(e => e.Email).HasColumnName("Email");

            entity.HasOne(e => e.Department)
                .WithMany(d => d.Employees)
                .HasForeignKey(e => e.D_ID);

            // Explicit mapping for User navigation to avoid EF creating a shadow FK (User_ID1)
            entity.HasOne(e => e.User)
                .WithMany(u => u.Employees)
                .HasForeignKey(e => e.User_ID)
                .OnDelete(DeleteBehavior.NoAction);
        });


        modelBuilder.Entity<Employee>()
        .HasMany(e => e.Projects)
        .WithMany(p => p.Employees)
        .UsingEntity<Dictionary<string, object>>(
                "Works_ON",
                j => j
                .HasOne<Project>()
                .WithMany()
                .HasForeignKey("Prj_ID"),
                j => j
                .HasOne<Employee>()
                .WithMany()
                .HasForeignKey("Employee_ID"),
                j =>
                {
                j.HasKey("Employee_ID", "Prj_ID");
                j.ToTable("Works_ON");
                });


        // =========================
        // OSE
        // =========================
        modelBuilder.Entity<OSE>()
            .HasKey(e => e.OSE_ID);

        modelBuilder.Entity<OSE>()
            .HasOne(e => e.Planner)
            .WithOne()
            .HasForeignKey<OSE>(e => e.Planner_ID);

        modelBuilder.Entity<OSE>()
            .HasOne(e => e.Interviewer)
            .WithOne()
            .HasForeignKey<OSE>(e => e.Interviewer_ID);

        modelBuilder.Entity<OSE>()
            .HasOne(e => e.User)
            .WithOne()
            .HasForeignKey<OSE>(e => e.User_ID);

        modelBuilder.Entity<OSE>()
            .HasOne(e => e.Employee)
            .WithOne()
            .HasForeignKey<OSE>(e => e.EMP_ID);


        modelBuilder.Entity<Project>()
    .HasKey(p => p.Prj_ID);
        modelBuilder.Entity<Project>()
            .Property(p => p.Prj_ID)
            .HasColumnName("Prj_ID")
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<Project>()
            .HasOne(p => p.BO)
    .WithMany()
    .HasForeignKey(p => p.BO_ID);

    
modelBuilder.Entity<BO>()
    .HasKey(b => b.BO_ID);
    modelBuilder.Entity<BO>(entity =>
    {
        entity.ToTable("BO");
        entity.HasKey(b => b.BO_ID);
        entity.Property(b => b.BO_ID).HasColumnName("BO_ID");
        entity.Property(b => b.Name).HasColumnName("Name");
        entity.Property(b => b.Business_Area).HasColumnName("Business_Area");
        entity.Property(b => b.Email).HasColumnName("Email");
        entity.Property(b => b.Phone).HasColumnName("Phone");
        entity.Property(b => b.User_ID).HasColumnName("User_ID");

        entity.HasOne(b => b.User)
            .WithMany(u => u.BusinessOwners)
            .HasForeignKey(b => b.User_ID)
            .OnDelete(DeleteBehavior.NoAction);
    });

        // =========================
        // Resource Planner
        // =========================
        modelBuilder.Entity<ResourcePlanner>(entity =>
        {
            entity.ToTable("Resource_Planner");

            entity.HasKey(e => e.Planner_ID);

            entity.Property(e => e.Planner_ID)
                .HasColumnName("Planner_ID");

            entity.Property(e => e.Name)
                .HasColumnName("Name");

            entity.Property(e => e.Email)
                .HasColumnName("Email");

            entity.Property(e => e.Phone)
                .HasColumnName("Phone");

            entity.Property(e => e.User_ID)
                .HasColumnName("User_ID");

            // explicit FK mapping using the `User.ResourcePlanners` navigation
            // to avoid EF creating a shadow FK column (e.g. User_ID1)
            entity.HasOne(r => r.User)
                .WithMany(u => u.ResourcePlanners)
                .HasForeignKey(r => r.User_ID)
                .OnDelete(DeleteBehavior.NoAction);
        });
    }
}