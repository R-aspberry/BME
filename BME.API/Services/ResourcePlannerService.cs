using Microsoft.EntityFrameworkCore;
using BME.API.Data;
using BME.API.Models;
using BME.API.Services.Interfaces;

namespace BME.API.Services
{
    public class ResourcePlannerService : IResourcePlannerService
    {
        private readonly BMEDbContext _context;
        
        public ResourcePlannerService(BMEDbContext context)
        {
            _context = context;
        }

        public async Task<List<ResourcePlanner>> GetAllAsync()
        {
            return await _context.Resource_Planner
                .ToListAsync();
        }

        public async Task<ResourcePlanner?> GetByIdAsync(int id)
        {
            return await _context.Resource_Planner
                .FirstOrDefaultAsync(p => p.Planner_ID == id);
        }

        public async Task<ResourcePlanner> CreateAsync(ResourcePlanner planner)
        {
            _context.Resource_Planner.Add(planner);

            await _context.SaveChangesAsync();

            return planner;
        }

        public async Task<bool> UpdateAsync(
            int id,
            ResourcePlanner planner)
        {
            var existingPlanner = await _context.Resource_Planner
                .FirstOrDefaultAsync(p => p.Planner_ID == id);

            if (existingPlanner == null)
            {
                return false;
            }

            existingPlanner.Name = planner.Name;
            existingPlanner.Email = planner.Email;
            existingPlanner.Phone = planner.Phone;
            existingPlanner.User_ID = planner.User_ID;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var planner = await _context.Resource_Planner
                .FirstOrDefaultAsync(p => p.Planner_ID == id);

            if (planner == null)
            {
                return false;
            }

            _context.Resource_Planner.Remove(planner);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}