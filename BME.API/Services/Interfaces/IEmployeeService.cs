using BME.API.DTOs;

namespace BME.API.Services.Interfaces;

public interface IEmployeeService
{
    Task<IEnumerable<EmployeeDto>> GetAllAsync();
    Task<EmployeeDto> GetByIdAsync(int id);
    Task<EmployeeDto> CreateAsync(EmployeeDto dto);
    Task<EmployeeDto> UpdateAsync(int id, EmployeeDto dto);
    Task DeleteAsync(int id);
}
