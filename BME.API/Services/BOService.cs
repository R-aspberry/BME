using Microsoft.EntityFrameworkCore;
using BME.API.Data;
using BME.API.DTOs;
using BME.API.Models;

namespace BME.API.Services;

public class BOService
{
    private readonly BMEDbContext _context;

    public BOService(BMEDbContext context)
    {
        _context = context;
    }

    public async Task<List<BODto>> GetAllAsync()
    {
        return await _context.BOs
            .Select(bo => new BODto
            {
                BO_ID = bo.BO_ID,
                Name = bo.Name,
                Business_Area = bo.Business_Area,
                Email = bo.Email,
                Phone = bo.Phone,
                User_ID = bo.User_ID
            })
            .ToListAsync();
    }

    public async Task<BODto?> GetByIdAsync(int boId)
    {
        return await _context.BOs
            .Where(bo => bo.BO_ID == boId)
            .Select(bo => new BODto
            {
                BO_ID = bo.BO_ID,
                Name = bo.Name,
                Business_Area = bo.Business_Area,
                Email = bo.Email,
                Phone = bo.Phone,
                User_ID = bo.User_ID
            })
            .FirstOrDefaultAsync();
    }

    public async Task<BODto> CreateAsync(CreateBODto dto)
    {
        var bo = new BO
        {
            BO_ID = dto.BO_ID,
            Name = dto.Name,
            Business_Area = dto.Business_Area,
            Email = dto.Email,
            Phone = dto.Phone,
            User_ID = dto.User_ID
        };

        _context.BOs.Add(bo);

        await _context.SaveChangesAsync();

        return new BODto
        {
            BO_ID = bo.BO_ID,
            Name = bo.Name,
            Business_Area = bo.Business_Area,
            Email = bo.Email,
            Phone = bo.Phone,
            User_ID = bo.User_ID
        };
    }

    public async Task<BODto?> UpdateAsync(
        int id,
        UpdateBODto dto)
    {
        var bo = await _context.BOs.FindAsync(id);

        if (bo == null)
        {
            return null;
        }

        bo.BO_ID = dto.BO_ID;
        bo.Name = dto.Name;
        bo.Business_Area = dto.Business_Area;
        bo.Email = dto.Email;
        bo.Phone = dto.Phone;
        bo.User_ID = dto.User_ID;

        await _context.SaveChangesAsync();

        return new BODto
        {
            BO_ID = bo.BO_ID,
            Name = bo.Name,
            Business_Area = bo.Business_Area,
            Email = bo.Email,
            Phone = bo.Phone,
            User_ID = bo.User_ID
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var bo = await _context.BOs.FindAsync(id);

        if (bo == null)
        {
            return false;
        }

        _context.BOs.Remove(bo);

        await _context.SaveChangesAsync();

        return true;
    }
}