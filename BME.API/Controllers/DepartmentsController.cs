using Microsoft.AspNetCore.Mvc;
using BME.API.DTOs;
using BME.API.Services;

namespace BME.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly DepartmentService _departmentService;

    public DepartmentsController(DepartmentService departmentService)
    {
        _departmentService = departmentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetDepartments()
    {
        var departments = await _departmentService.GetAllAsync();

        return Ok(departments);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDepartment(int id)
    {
        var department = await _departmentService.GetByIdAsync(id);

        if (department == null)
        {
            return NotFound();
        }

        return Ok(department);
    }

    [HttpPost]
    public async Task<IActionResult> CreateDepartment(
        CreateDepartmentDto dto)
    {
        var department = await _departmentService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetDepartment),
            new { id = department.D_ID },
            department);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDepartment(
        int id,
        UpdateDepartmentDto dto)
    {
        var department = await _departmentService.UpdateAsync(id, dto);

        if (department == null)
        {
            return NotFound();
        }

        return Ok(department);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDepartment(int id)
    {
        var deleted = await _departmentService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}