using Microsoft.AspNetCore.Mvc;
using BME.API.DTOs;
using BME.API.Services;

namespace BME.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly ProjectService _projectService;

    public ProjectsController(ProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet]
    public async Task<ActionResult> GetProjects()
    {
        var projectDtos = await _projectService.GetAllAsync();

        return Ok(projectDtos);
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