using Microsoft.EntityFrameworkCore;
using BME.API.Models;

namespace BME.API.Data;

public class ResourceAllocationDbContext : DbContext
{
	public ResourceAllocationDbContext(DbContextOptions<ResourceAllocationDbContext> options)
		: base(options)
	{
	}

	public DbSet<Employee> Employees => Set<Employee>();
	public DbSet<User> Users => Set<User>();
	public DbSet<BO> BusinessOwners => Set<BO>();
	public DbSet<ResourcePlanner> ResourcePlanners => Set<ResourcePlanner>();

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		// Keep mappings minimal and compatible with existing models.
		modelBuilder.Entity<Employee>(entity =>
		{
			entity.ToTable("Employees");
			entity.HasKey(employee => employee.ID);
			entity.Property(employee => employee.ID).HasColumnName("ID");
			entity.Property(employee => employee.User_ID).HasColumnName("User_ID");
			entity.Property(employee => employee.Email).HasColumnName("Email").HasMaxLength(100).IsRequired();
			entity.Property(employee => employee.FN).HasColumnName("FN").HasMaxLength(50).IsRequired();
			entity.Property(employee => employee.LN).HasColumnName("LN").HasMaxLength(50).IsRequired();
			entity.Property(employee => employee.Title).HasColumnName("Title").HasMaxLength(100);
			entity.HasOne<User>().WithMany().HasForeignKey(employee => employee.User_ID);
		});

		modelBuilder.Entity<User>(entity =>
		{
			entity.ToTable("Users");
			entity.HasKey(user => user.User_ID);
			entity.Property(user => user.User_ID).HasColumnName("User_ID");
			entity.Property(user => user.User_Name).HasColumnName("User_Name").HasMaxLength(50).IsRequired();
			entity.Property(user => user.PasswordHash).HasMaxLength(255).IsRequired();
			entity.HasIndex(user => user.User_Name).IsUnique();
		});

		modelBuilder.Entity<BO>(entity =>
		{
			entity.ToTable("BO");
			entity.HasKey(owner => owner.BO_ID);
			entity.Property(owner => owner.BO_ID).HasColumnName("BO_ID");
			entity.Property(owner => owner.User_ID).HasColumnName("User_ID");
			entity.HasOne<User>().WithMany().HasForeignKey(owner => owner.User_ID);
		});

		modelBuilder.Entity<ResourcePlanner>(entity =>
		{
			entity.ToTable("Resource_Planner");
			entity.HasKey(planner => planner.Planner_ID);
			entity.Property(planner => planner.Planner_ID).HasColumnName("Planner_ID");
			entity.Property(planner => planner.User_ID).HasColumnName("User_ID");
			entity.HasOne<User>().WithMany(user => user.ResourcePlanners).HasForeignKey(planner => planner.User_ID);
		});
	}
}
