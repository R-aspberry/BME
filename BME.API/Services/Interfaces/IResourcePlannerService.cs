using BME.API.Models;

namespace BME.API.Services.Interfaces
{
    public interface IResourcePlannerService
    {
        Task<List<ResourcePlanner>> GetAllAsync();

        Task<ResourcePlanner?> GetByIdAsync(int id);

        Task<ResourcePlanner> CreateAsync(ResourcePlanner planner);

        Task<bool> UpdateAsync(int id, ResourcePlanner planner);

        Task<bool> DeleteAsync(int id);
    }
}