using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BME.API.Data;
using BME.API.DTOs;
using BME.API.Services;

namespace BME.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly ProjectService _projectService;
    private readonly BMEDbContext _context;

    public ProjectsController(ProjectService projectService, BMEDbContext context)
    {
        _projectService = projectService;
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetProjects()
    {
        var projectDtos = await _projectService.GetAllAsync();

        return Ok(projectDtos);
    }

    [HttpGet("mine")]
    [Authorize]
    public async Task<ActionResult> GetMyProjects()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdValue, out var userId)) return Unauthorized();

        var projects = await _context.Projects
            .Where(project => project.Employees.Any(employee => employee.User_ID == userId))
            .Select(project => new ProjectDto
            {
                Prj_ID = project.Prj_ID,
                Project_Name = project.Project_Name,
                Flag = project.Flag,
                Status = project.Status,
                Description = project.Description,
                Budget = project.Budget,
                MVP = project.MVP,
                BRD = project.BRD,
                Start_date = project.Start_date,
                End_date = project.End_date,
                BO_ID = project.BO_ID
            })
            .ToListAsync();

        return Ok(projects);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetProject(int id)
    {
        var projectDto = await _projectService.GetByIdAsync(id);

        if (projectDto == null)
        {
            return NotFound();
        }

        return Ok(projectDto);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject(
        CreateProjectDto dto)
    {
        var project = await _projectService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetProject),
            new { id = project.Prj_ID },
            project);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(
        int id,
        UpdateProjectDto dto)
    {
        var project = await _projectService.UpdateAsync(id, dto);

        if (project == null)
        {
            return NotFound();
        }

        return Ok(project);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var deleted = await _projectService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}