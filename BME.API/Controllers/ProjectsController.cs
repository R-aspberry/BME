using BME.Backend.DTOs;
using BME.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace BME.Backend.Controllers;

[ApiController]
[Route("api/projects")]
public class ProjectController : ControllerBase
{
    private readonly ProjectService _projectService;

    public ProjectController(ProjectService projectService)
    {
        _projectService = projectService;
    }

    // GET: /api/projects
    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        var projects = await _projectService.GetAllProjectsAsync();

        return Ok(projects);
    }

    // GET: /api/projects/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProject(int id)
    {
        var project = await _projectService.GetProjectByIdAsync(id);

        if (project == null)
        {
            return NotFound(new
            {
                message = "Project not found."
            });
        }

        return Ok(project);
    }

    // POST: /api/projects
    [HttpPost]
    public async Task<IActionResult> CreateProject(
        [FromBody] CreateProjectDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var project = await _projectService.CreateProjectAsync(dto);

        if (project == null)
        {
            return BadRequest(new
            {
                message = "The specified Business Owner does not exist."
            });
        }

        return CreatedAtAction(
            nameof(GetProject),
            new { id = project.PrjId },
            project);
    }

    // PUT: /api/projects/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(
        int id,
        [FromBody] UpdateProjectDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var project = await _projectService.UpdateProjectAsync(id, dto);

        if (project == null)
        {
            return NotFound(new
            {
                message = "Project not found or Business Owner does not exist."
            });
        }

        return Ok(project);
    }

    // DELETE: /api/projects/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var deleted = await _projectService.DeleteProjectAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Project not found."
            });
        }

        return Ok(new
        {
            message = "Project deleted successfully."
        });
    }
}