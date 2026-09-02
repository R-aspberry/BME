using BME.API.DTOs;

namespace BME.API.Services.Interfaces;

public interface IResourcePlannerService
{
    Task<IEnumerable<ResourcePlannerDto>> GetAllAsync();
    Task<ResourcePlannerDto> GetByIdAsync(int id);
    Task<ResourcePlannerDto> CreateAsync(ResourcePlannerDto dto);
    Task<ResourcePlannerDto> UpdateAsync(int id, ResourcePlannerDto dto);
    Task DeleteAsync(int id);
}
