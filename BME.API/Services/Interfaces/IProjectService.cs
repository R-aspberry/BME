using BME.API.DTOs;

namespace BME.API.Services.Interfaces;

public interface IProjectService
{
    Task<IEnumerable<ProjectDto>> GetAllAsync();
    Task<ProjectDto> GetByIdAsync(int id);
    Task<ProjectDto> CreateAsync(ProjectDto dto);
    Task<ProjectDto> UpdateAsync(int id, ProjectDto dto);
    Task DeleteAsync(int id);
}
