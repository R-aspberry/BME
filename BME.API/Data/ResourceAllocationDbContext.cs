using Microsoft.EntityFrameworkCore;
using BME.API.Models;

namespace BME.API.Data
{
    public class ResourceAllocationDbContext : DbContext
    {
        public ResourceAllocationDbContext(
            DbContextOptions<ResourceAllocationDbContext> options)
            : base(options)
        {
        }

        public DbSet<ResourcePlanner> ResourcePlanners { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ResourcePlanner>(entity =>
            {
                entity.ToTable("Resource_Planner");

                entity.HasKey(e => e.PlannerId);

                entity.Property(e => e.PlannerId)
                    .HasColumnName("Planner_ID");

                entity.Property(e => e.Name)
                    .HasColumnName("Name")
                    .HasMaxLength(100);

                entity.Property(e => e.Email)
                    .HasColumnName("Email")
                    .HasMaxLength(100);

                entity.Property(e => e.Phone)
                    .HasColumnName("Phone")
                    .HasMaxLength(20);

                entity.Property(e => e.UserId)
                    .HasColumnName("User_ID");
            });
        }
    }
}