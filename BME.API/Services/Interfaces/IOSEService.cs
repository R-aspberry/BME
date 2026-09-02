using BME.API.DTOs;

namespace BME.API.Services.Interfaces;

public interface IOSEService
{
    Task<IEnumerable<OSEDto>> GetAllAsync();
    Task<OSEDto> GetByIdAsync(int id);
    Task<OSEDto> CreateAsync(OSEDto dto);
    Task<OSEDto> UpdateAsync(int id, OSEDto dto);
    Task DeleteAsync(int id);
}
