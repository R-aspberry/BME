using Microsoft.EntityFrameworkCore;
using BME.API.Data;
using BME.API.DTOs;
using BME.API.Models;

namespace BME.API.Services;

public class EmployeeService
{
    private readonly BMEDbContext _context;

    public EmployeeService(BMEDbContext context)
    {
        _context = context;
    }

    public async Task<List<EmployeeDto>> GetAllAsync()
    {
        return await _context.Employees
            .Select(e => new EmployeeDto
            {
                ID = e.ID,
                FN = e.FN,
                LN = e.LN,
                Title = e.Title,
                Email = e.Email,
                DepartmentName = e.Department != null ? e.Department.D_Name : null
            })
            .ToListAsync();
    }

    public async Task<EmployeeDto?> GetByIdAsync(int id)
    {
        return await _context.Employees
        .Where(e => e.ID == id)
        .Select(e => new EmployeeDto
        {
            ID = e.ID,
            FN = e.FN,
            LN = e.LN,
            Title = e.Title,
            Email = e.Email,
            DepartmentName = e.Department != null ? e.Department.D_Name : null
        })
        .FirstOrDefaultAsync();
    }

    public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto)
    {
        var employee = new Employee
        {
            ID = dto.ID,
            User_ID = dto.User_ID,
            FN = dto.FN,
            LN = dto.LN,
            Title = dto.Title,
            DOB = dto.DOB,
            Hired_Date = dto.Hired_Date,
            Email = dto.Email,
            Phone = dto.Phone,
            Vendor_Name = dto.Vendor_Name,
            Years_OF_Experience = dto.Years_OF_Experience,
            Is_OSE = dto.Is_OSE,
            OSE_ID = dto.OSE_ID,
            Manager_ID = dto.Manager_ID,
            D_ID = dto.D_ID,
            Type_of_contract_ID = dto.Type_of_contract_ID
        };

        _context.Employees.Add(employee);

        await _context.SaveChangesAsync();

        return new EmployeeDto
        {
            ID = employee.ID,
            FN = employee.FN,
            LN = employee.LN,
            Title = employee.Title,
            Email = employee.Email,
            DepartmentName = employee.Department?.D_Name
        };
    }

    public async Task<EmployeeDto?> UpdateAsync(int id, UpdateEmployeeDto dto)
    {
        var employee = await _context.Employees
            .FindAsync(id);

        if (employee == null)
        {
            return null;
        }

        employee.User_ID = dto.User_ID;
        employee.FN = dto.FN;
        employee.LN = dto.LN;
        employee.Title = dto.Title;
        employee.DOB = dto.DOB;
        employee.Hired_Date = dto.Hired_Date;
        employee.Email = dto.Email;
        employee.Phone = dto.Phone;
        employee.Vendor_Name = dto.Vendor_Name;
        employee.Years_OF_Experience = dto.Years_OF_Experience;
        employee.Is_OSE = dto.Is_OSE;
        employee.OSE_ID = dto.OSE_ID;
        employee.Manager_ID = dto.Manager_ID;
        employee.D_ID = dto.D_ID;
        employee.Type_of_contract_ID = dto.Type_of_contract_ID;

        await _context.SaveChangesAsync();

        return new EmployeeDto
        {
            ID = employee.ID,
            FN = employee.FN,
            LN = employee.LN,
            Title = employee.Title,
            Email = employee.Email,
            DepartmentName = employee.Department?.D_Name
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var employee = await _context.Employees.FindAsync(id);

        if (employee == null)
        {
            return false;
        }

        _context.Employees.Remove(employee);

        await _context.SaveChangesAsync();

        return true;
    }
}