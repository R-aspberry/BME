using AutoMapper;
using BME.API.Data;
using BME.API.DTOs;
using BME.API.Exceptions;
using BME.API.Models;
using BME.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BME.API.Services;

public class DepartmentService : IDepartmentService
{
    private readonly ResourceAllocationDbContext _context;
    private readonly IMapper _mapper;

    public DepartmentService(ResourceAllocationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<DepartmentDto>> GetAllAsync()
    {
        var departments = await _context.Departments.AsNoTracking().ToListAsync();
        return _mapper.Map<IEnumerable<DepartmentDto>>(departments);
    }

    public async Task<DepartmentDto> GetByIdAsync(int id)
    {
        var department = await _context.Departments.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new NotFoundException($"Department with id {id} was not found.");

        return _mapper.Map<DepartmentDto>(department);
    }

    public async Task<DepartmentDto> CreateAsync(DepartmentDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new BadRequestException("Department name is required.");
        }

        var department = _mapper.Map<Department>(dto);
        _context.Departments.Add(department);
        await _context.SaveChangesAsync();

        return _mapper.Map<DepartmentDto>(department);
    }

    public async Task<DepartmentDto> UpdateAsync(int id, DepartmentDto dto)
    {
        var department = await _context.Departments.FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new NotFoundException($"Department with id {id} was not found.");

        department.Name = dto.Name;
        department.Description = dto.Description;

        await _context.SaveChangesAsync();
        return _mapper.Map<DepartmentDto>(department);
    }

    public async Task DeleteAsync(int id)
    {
        var department = await _context.Departments.FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new NotFoundException($"Department with id {id} was not found.");

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();
    }
}
