using Microsoft.EntityFrameworkCore;
using MERL.API.Models;

namespace MERL.API.Data;

public class ResourceAllocationDbContext(DbContextOptions<ResourceAllocationDbContext> options) : DbContext(options)
{
	public DbSet<Employee> Employees => Set<Employee>();
	public DbSet<User> Users => Set<User>();
	public DbSet<BusinessOwner> BusinessOwners => Set<BusinessOwner>();
	public DbSet<ResourcePlanner> ResourcePlanners => Set<ResourcePlanner>();

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<Employee>(entity =>
		{
			entity.ToTable("Employees");
			entity.HasKey(employee => employee.Id);
			entity.Property(employee => employee.Id).HasColumnName("ID");
			entity.Property(employee => employee.UserId).HasColumnName("User_ID");
			entity.Property(employee => employee.Email).HasColumnName("Email").HasMaxLength(100).IsRequired();
			entity.Property(employee => employee.FirstName).HasColumnName("FN").HasMaxLength(50).IsRequired();
			entity.Property(employee => employee.LastName).HasColumnName("LN").HasMaxLength(50).IsRequired();
			entity.Property(employee => employee.Title).HasColumnName("Title").HasMaxLength(100);
			entity.HasOne<User>().WithMany(user => user.Employees).HasForeignKey(employee => employee.UserId);
		});

		modelBuilder.Entity<User>(entity =>
		{
			entity.ToTable("Users");
			entity.HasKey(user => user.UserId);
			entity.Property(user => user.UserId).HasColumnName("User_ID");
			entity.Property(user => user.UserName).HasColumnName("User_Name").HasMaxLength(50).IsRequired();
			entity.Property(user => user.PasswordHash).HasMaxLength(255).IsRequired();
			entity.HasIndex(user => user.UserName).IsUnique();
		});

		modelBuilder.Entity<BusinessOwner>(entity =>
		{
			entity.ToTable("BO");
			entity.HasKey(owner => owner.Id);
			entity.Property(owner => owner.Id).HasColumnName("BO_ID");
			entity.Property(owner => owner.UserId).HasColumnName("User_ID");
			entity.HasOne<User>().WithMany(user => user.BusinessOwners).HasForeignKey(owner => owner.UserId);
		});

		modelBuilder.Entity<ResourcePlanner>(entity =>
		{
			entity.ToTable("Resource_Planner");
			entity.HasKey(planner => planner.Id);
			entity.Property(planner => planner.Id).HasColumnName("Planner_ID");
			entity.Property(planner => planner.UserId).HasColumnName("User_ID");
			entity.HasOne<User>().WithMany(user => user.ResourcePlanners).HasForeignKey(planner => planner.UserId);
		});
	}
}
