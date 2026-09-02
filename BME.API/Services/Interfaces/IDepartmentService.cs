using BME.API.DTOs;

namespace BME.API.Services.Interfaces;

public interface IDepartmentService
{
    Task<IEnumerable<DepartmentDto>> GetAllAsync();
    Task<DepartmentDto> GetByIdAsync(int id);
    Task<DepartmentDto> CreateAsync(DepartmentDto dto);
    Task<DepartmentDto> UpdateAsync(int id, DepartmentDto dto);
    Task DeleteAsync(int id);
}
