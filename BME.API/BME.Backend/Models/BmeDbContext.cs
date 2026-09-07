using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace BME.Backend.Models;

public partial class BmeDbContext : DbContext
{
    public BmeDbContext()
    {
    }

    public BmeDbContext(DbContextOptions<BmeDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Bo> Bos { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<Ose> Oses { get; set; }

    public virtual DbSet<Project> Projects { get; set; }

    public virtual DbSet<ResourcePlanner> ResourcePlanners { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=LAPTOP-UNVFC07F;Database=master;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Bo>(entity =>
        {
            entity.HasKey(e => e.BoId).HasName("PK__BO__D4ABCFC678D0AA8C");

            entity.ToTable("BO");

            entity.Property(e => e.BoId)
                .ValueGeneratedNever()
                .HasColumnName("BO_ID");
            entity.Property(e => e.BusinessArea)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Business_Area");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.UserId).HasColumnName("User_ID");

            entity.HasOne(d => d.User).WithMany(p => p.Bos)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__BO__User_ID__47919582");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.DId).HasName("PK__Departme__76B8FF7D99D56C38");

            entity.ToTable("Department");

            entity.Property(e => e.DId)
                .ValueGeneratedNever()
                .HasColumnName("D_ID");
            entity.Property(e => e.DName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("D_Name");
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Employee__3214EC278916CA21");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("ID");
            entity.Property(e => e.DId).HasColumnName("D_ID");
            entity.Property(e => e.Dob).HasColumnName("DOB");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Fn)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FN");
            entity.Property(e => e.HiredDate).HasColumnName("Hired_Date");
            entity.Property(e => e.IsOse).HasColumnName("Is_OSE");
            entity.Property(e => e.Ln)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("LN");
            entity.Property(e => e.ManagerId).HasColumnName("Manager_ID");
            entity.Property(e => e.OseId).HasColumnName("OSE_ID");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.TypeOfContractId).HasColumnName("Type_of_contract_ID");
            entity.Property(e => e.UserId).HasColumnName("User_ID");
            entity.Property(e => e.VendorName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Vendor_Name");
            entity.Property(e => e.YearsOfExperience).HasColumnName("Years_OF_Experience");

            entity.HasOne(d => d.DIdNavigation).WithMany(p => p.Employees)
                .HasForeignKey(d => d.DId)
                .HasConstraintName("FK__Employees__D_ID__43C1049E");

            entity.HasOne(d => d.Manager).WithMany(p => p.InverseManager)
                .HasForeignKey(d => d.ManagerId)
                .HasConstraintName("FK__Employees__Manag__42CCE065");

            entity.HasOne(d => d.User).WithMany(p => p.Employees)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Employees__User___41D8BC2C");

            entity.HasMany(d => d.Prjs).WithMany(p => p.Employees)
                .UsingEntity<Dictionary<string, object>>(
                    "WorksOn",
                    r => r.HasOne<Project>().WithMany()
                        .HasForeignKey("PrjId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__Works_ON__Prj_ID__4E3E9311"),
                    l => l.HasOne<Employee>().WithMany()
                        .HasForeignKey("EmployeeId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__Works_ON__Employ__4D4A6ED8"),
                    j =>
                    {
                        j.HasKey("EmployeeId", "PrjId").HasName("PK__Works_ON__A9E9E6944827EEAB");
                        j.ToTable("Works_ON");
                        j.IndexerProperty<int>("EmployeeId").HasColumnName("Employee_ID");
                        j.IndexerProperty<int>("PrjId").HasColumnName("Prj_ID");
                    });
        });

        modelBuilder.Entity<Ose>(entity =>
        {
            entity.HasKey(e => e.OseId).HasName("PK__OSE__6404146FDED9ED29");

            entity.ToTable("OSE");

            entity.Property(e => e.OseId)
                .ValueGeneratedNever()
                .HasColumnName("OSE_ID");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EmpId).HasColumnName("EMP_ID");
            entity.Property(e => e.Fn)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FN");
            entity.Property(e => e.InterviewerId).HasColumnName("Interviewer_ID");
            entity.Property(e => e.Ln)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("LN");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.PlannerId).HasColumnName("Planner_ID");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UserId).HasColumnName("User_ID");
            entity.Property(e => e.Vendor)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.Emp).WithMany(p => p.OseEmps)
                .HasForeignKey(d => d.EmpId)
                .HasConstraintName("FK__OSE__EMP_ID__53F76C67");

            entity.HasOne(d => d.Interviewer).WithMany(p => p.OseInterviewers)
                .HasForeignKey(d => d.InterviewerId)
                .HasConstraintName("FK__OSE__Interviewer__56D3D912");

            entity.HasOne(d => d.Planner).WithMany(p => p.Oses)
                .HasForeignKey(d => d.PlannerId)
                .HasConstraintName("FK__OSE__Planner_ID__55DFB4D9");

            entity.HasOne(d => d.User).WithMany(p => p.Oses)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__OSE__User_ID__54EB90A0");
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.PrjId).HasName("PK__Projects__1F8D215C54E80A37");

            entity.Property(e => e.PrjId)
                .ValueGeneratedNever()
                .HasColumnName("Prj_ID");
            entity.Property(e => e.BoId).HasColumnName("BO_ID");
            entity.Property(e => e.Brd)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("BRD");
            entity.Property(e => e.Budget).HasColumnType("decimal(15, 2)");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.EndDate).HasColumnName("End_date");
            entity.Property(e => e.Flag)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Mvp)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("MVP");
            entity.Property(e => e.ProjectName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("Project_Name");
            entity.Property(e => e.StartDate).HasColumnName("Start_date");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Bo).WithMany(p => p.Projects)
                .HasForeignKey(d => d.BoId)
                .HasConstraintName("FK__Projects__BO_ID__4A6E022D");
        });

        modelBuilder.Entity<ResourcePlanner>(entity =>
        {
            entity.HasKey(e => e.PlannerId).HasName("PK__Resource__1B3A2B46FA7D616E");

            entity.ToTable("Resource_Planner");

            entity.Property(e => e.PlannerId)
                .ValueGeneratedNever()
                .HasColumnName("Planner_ID");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.UserId).HasColumnName("User_ID");

            entity.HasOne(d => d.User).WithMany(p => p.ResourcePlanners)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Resource___User___511AFFBC");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__206D9190EF5D2057");

            entity.Property(e => e.UserId)
                .ValueGeneratedNever()
                .HasColumnName("User_ID");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.UserName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("User_Name");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
