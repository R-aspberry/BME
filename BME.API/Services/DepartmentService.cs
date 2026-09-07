using Microsoft.EntityFrameworkCore;
using BME.API.Data;
using BME.API.DTOs;
using BME.API.Models;

namespace BME.API.Services;

public class DepartmentService
{
    private readonly BMEDbContext _context;

    public DepartmentService(BMEDbContext context)
    {
        _context = context;
    }

    public async Task<List<DepartmentDto>> GetAllAsync()
    {
        return await _context.Departments
            .Select(d => new DepartmentDto
            {
                D_ID = d.D_ID,
                D_Name = d.D_Name,
                Availability = d.Availability
            })
            .ToListAsync();
    }

    public async Task<DepartmentDto?> GetByIdAsync(int id)
    {
        var department = await _context.Departments
            .FirstOrDefaultAsync(d => d.D_ID == id);

        if (department == null)
        {
            return null;
        }

        return new DepartmentDto
        {
            D_ID = department.D_ID,
            D_Name = department.D_Name,
            Availability = department.Availability
        };
    }

    public async Task<DepartmentDto> CreateAsync(
        CreateDepartmentDto dto)
    {
        var department = new Department
        {
            D_ID = dto.D_ID,
            D_Name = dto.D_Name,
            Availability = dto.Availability
        };

        _context.Departments.Add(department);

        await _context.SaveChangesAsync();

        return new DepartmentDto
        {
            D_ID = department.D_ID,
            D_Name = department.D_Name,
            Availability = department.Availability
        };
    }

    public async Task<DepartmentDto?> UpdateAsync(
        int id,
        UpdateDepartmentDto dto)
    {
        var department = await _context.Departments
            .FirstOrDefaultAsync(d => d.D_ID == id);

        if (department == null)
        {
            return null;
        }

        department.D_Name = dto.D_Name;
        department.Availability = dto.Availability;

        await _context.SaveChangesAsync();

        return new DepartmentDto
        {
            D_ID = department.D_ID,
            D_Name = department.D_Name,
            Availability = department.Availability
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var department = await _context.Departments
            .FirstOrDefaultAsync(d => d.D_ID == id);

        if (department == null)
        {
            return false;
        }

        _context.Departments.Remove(department);

        await _context.SaveChangesAsync();

        return true;
    }
}