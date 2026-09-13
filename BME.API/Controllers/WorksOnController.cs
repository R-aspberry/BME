using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using BME.API.Data;

namespace BME.API.Controllers;

[ApiController]
[Route("api/works-on")]
[Authorize]
public class WorksOnController : ControllerBase
{
    private readonly BMEDbContext _context;

    public WorksOnController(BMEDbContext context)
    {
        _context = context;
    }

    // GET /api/works-on
    [HttpGet]
    public async Task<IActionResult> GetAssignments(
        CancellationToken cancellationToken)
    {
        var connection = _context.Database.GetDbConnection();
        var shouldClose =
            connection.State != System.Data.ConnectionState.Open;

        try
        {
            if (shouldClose)
                await connection.OpenAsync(cancellationToken);

            await using var command = connection.CreateCommand();
            command.CommandText =
                "SELECT Employee_ID, Prj_ID FROM Works_ON";

            await using var reader =
                await command.ExecuteReaderAsync(cancellationToken);

            var result = new List<WorksOnDto>();

            while (await reader.ReadAsync(cancellationToken))
            {
                result.Add(new WorksOnDto
                {
                    Employee_ID = reader.GetInt32(0),
                    Prj_ID = reader.GetInt32(1)
                });
            }

            return Ok(result);
        }
        finally
        {
            if (shouldClose)
                await connection.CloseAsync();
        }
    }

    // POST /api/works-on
    [HttpPost]
    public async Task<IActionResult> AssignEmployee(
        [FromBody] WorksOnRequest request,
        CancellationToken cancellationToken)
    {
        if (request.Employee_ID <= 0 || request.Prj_ID <= 0)
        {
            return BadRequest(
                "Employee_ID and Prj_ID must be positive values.");
        }

        var employeeExists = await _context.Employees
            .AnyAsync(
                e => e.ID == request.Employee_ID,
                cancellationToken);

        if (!employeeExists)
        {
            return NotFound(
                $"Employee {request.Employee_ID} was not found.");
        }

        var projectExists = await _context.Projects
            .AnyAsync(
                p => p.Prj_ID == request.Prj_ID,
                cancellationToken);

        if (!projectExists)
        {
            return NotFound(
                $"Project {request.Prj_ID} was not found.");
        }

        try
        {
            await _context.Database.ExecuteSqlInterpolatedAsync($@"
                INSERT INTO Works_ON (Employee_ID, Prj_ID)
                VALUES ({request.Employee_ID}, {request.Prj_ID})
            ", cancellationToken);
        }
        catch (SqlException ex)
            when (ex.Number == 2627 || ex.Number == 2601)
        {
            return Conflict(
                "This employee is already assigned to this project.");
        }

        return Ok(new WorksOnDto
        {
            Employee_ID = request.Employee_ID,
            Prj_ID = request.Prj_ID
        });
    }
}

public sealed class WorksOnRequest
{
    public int Employee_ID { get; set; }
    public int Prj_ID { get; set; }
}

public sealed class WorksOnDto
{
    public int Employee_ID { get; set; }
    public int Prj_ID { get; set; }
}