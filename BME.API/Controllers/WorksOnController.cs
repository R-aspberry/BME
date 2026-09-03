using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class WorksOnController : ControllerBase
    {
        private readonly IWorksOnService _service;

        public WorksOnController(IWorksOnService service)
        {
            _service = service;
        }

        // GET /api/projects/{projectId}/employees
        [HttpGet("projects/{projectId}/employees")]
        public async Task<IActionResult> GetEmployeesForProject(int projectId)
        {
            if (!await _service.ProjectExistsAsync(projectId))
                return NotFound($"Project {projectId} does not exist.");

            var result = await _service.GetEmployeesByProjectAsync(projectId);
            return Ok(result); // [] if project exists but has nobody assigned
        }

        // GET /api/employees/{employeeId}/projects
        [HttpGet("employees/{employeeId}/projects")]
        public async Task<IActionResult> GetProjectsForEmployee(int employeeId)
        {
            if (!await _service.EmployeeExistsAsync(employeeId))
                return NotFound($"Employee {employeeId} does not exist.");

            var result = await _service.GetProjectsByEmployeeAsync(employeeId);
            return Ok(result); // [] if employee exists but has no assignments
        }

        // POST /api/projects/{projectId}/employees/{employeeId}
        [HttpPost("projects/{projectId}/employees/{employeeId}")]
        public async Task<IActionResult> AssignEmployee(int projectId, int employeeId)
        {
            var (result, created) = await _service.AssignEmployeeAsync(projectId, employeeId);

            return result switch
            {
                AssignmentResult.ProjectNotFound => NotFound($"Project {projectId} does not exist."),
                AssignmentResult.EmployeeNotFound => NotFound($"Employee {employeeId} does not exist."),
                AssignmentResult.AlreadyAssigned => Conflict($"Employee {employeeId} is already assigned to project {projectId}."),
                AssignmentResult.Success => CreatedAtAction(
                    nameof(GetEmployeesForProject),
                    new { projectId },
                    created), // returns { employee_ID, prj_ID } in the body
                _ => StatusCode(500, "Unexpected error.")
            };
        }

        // DELETE /api/projects/{projectId}/employees/{employeeId}
        [HttpDelete("projects/{projectId}/employees/{employeeId}")]
        public async Task<IActionResult> RemoveAssignment(int projectId, int employeeId)
        {
            var result = await _service.RemoveAssignmentAsync(projectId, employeeId);

            return result switch
            {
                AssignmentResult.AssignmentNotFound => NotFound($"No assignment found for project {projectId} and employee {employeeId}."),
                AssignmentResult.Success => NoContent(),
                _ => StatusCode(500, "Unexpected error.")
            };
        }
    }
}
