using Microsoft.EntityFrameworkCore;
using BME.API.Data;
using BME.API.Models;
using BME.API.Services.Interfaces;

namespace BME.API.Services
{
    public class ResourcePlannerService : IResourcePlannerService
    {
        private readonly ResourceAllocationDbContext _context;

        public ResourcePlannerService(ResourceAllocationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ResourcePlanner>> GetAllAsync()
        {
            return await _context.ResourcePlanners
                .ToListAsync();
        }

        public async Task<ResourcePlanner?> GetByIdAsync(int id)
        {
            return await _context.ResourcePlanners
                .FirstOrDefaultAsync(p => p.PlannerId == id);
        }

        public async Task<ResourcePlanner> CreateAsync(ResourcePlanner planner)
        {
            _context.ResourcePlanners.Add(planner);
            await _context.SaveChangesAsync();

            return planner;
        }

        public async Task<bool> UpdateAsync(int id, ResourcePlanner planner)
        {
            var existingPlanner = await _context.ResourcePlanners
                .FirstOrDefaultAsync(p => p.PlannerId == id);

            if (existingPlanner == null)
            {
                return false;
            }

            existingPlanner.Name = planner.Name;
            existingPlanner.Email = planner.Email;
            existingPlanner.Phone = planner.Phone;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var planner = await _context.ResourcePlanners
                .FirstOrDefaultAsync(p => p.PlannerId == id);

            if (planner == null)
            {
                return false;
            }

            _context.ResourcePlanners.Remove(planner);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}