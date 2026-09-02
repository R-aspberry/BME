using AutoMapper;
using BME.API.Data;
using BME.API.DTOs;
using BME.API.Exceptions;
using BME.API.Models;
using BME.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BME.API.Services;

public class EmployeeService : IEmployeeService
{
    private readonly ResourceAllocationDbContext _context;
    private readonly IMapper _mapper;

    public EmployeeService(ResourceAllocationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<EmployeeDto>> GetAllAsync()
    {
        var employees = await _context.Employees.AsNoTracking().ToListAsync();
        return _mapper.Map<IEnumerable<EmployeeDto>>(employees);
    }

    public async Task<EmployeeDto> GetByIdAsync(int id)
    {
        var employee = await _context.Employees.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new NotFoundException($"Employee with id {id} was not found.");

        return _mapper.Map<EmployeeDto>(employee);
    }

    public async Task<EmployeeDto> CreateAsync(EmployeeDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.FirstName) || string.IsNullOrWhiteSpace(dto.LastName))
        {
            throw new BadRequestException("Employee first and last name are required.");
        }

        var employee = _mapper.Map<Employee>(dto);
        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        return _mapper.Map<EmployeeDto>(employee);
    }

    public async Task<EmployeeDto> UpdateAsync(int id, EmployeeDto dto)
    {
        var employee = await _context.Employees.FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new NotFoundException($"Employee with id {id} was not found.");

        employee.FirstName = dto.FirstName;
        employee.LastName = dto.LastName;
        employee.Email = dto.Email;
        employee.Role = dto.Role;
        employee.DepartmentId = dto.DepartmentId;

        await _context.SaveChangesAsync();
        return _mapper.Map<EmployeeDto>(employee);
    }

    public async Task DeleteAsync(int id)
    {
        var employee = await _context.Employees.FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new NotFoundException($"Employee with id {id} was not found.");

        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync();
    }
}
