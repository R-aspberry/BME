using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BME.API.Data;
using BME.API.DTOs;
using BME.API.Models;

namespace BME.API.Controllers;

[ApiController]
[Route("api/staffing-requests")]
public class StaffingRequestsController(BMEDbContext context) : ControllerBase
{
    [HttpGet("po")]
    public async Task<ActionResult<List<StaffingRequestDto>>> GetPORequests() =>
        Ok((await context.PORequests.OrderByDescending(request => request.Created_At).ToListAsync()).Select(ToDto));

    [HttpPost("po")]
    public async Task<ActionResult<StaffingRequestDto>> CreatePORequest(CreateStaffingRequestDto dto)
    {
        var request = new PORequest
        {
            Department = dto.Department,
            Required_Count = dto.Required_Count,
            Details = dto.Details,
            Planner_ID = dto.Planner_ID,
            Status = "Pending"
        };
        context.PORequests.Add(request);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPORequest), new { id = request.Request_ID }, ToDto(request));
    }

    [HttpGet("po/{id:int}")]
    public async Task<ActionResult<StaffingRequestDto>> GetPORequest(int id)
    {
        var request = await context.PORequests.FindAsync(id);
        return request is null ? NotFound() : Ok(ToDto(request));
    }

    [HttpPatch("po/{id:int}/status")]
    public async Task<IActionResult> UpdatePOStatus(int id, UpdateStaffingRequestStatusDto dto) =>
        await UpdateStatus(context, context.PORequests, id, dto.Status);

    [HttpGet("planner")]
    public async Task<ActionResult<List<StaffingRequestDto>>> GetPlannerRequests() =>
        Ok((await context.PlannerRequests.OrderByDescending(request => request.Created_At).ToListAsync()).Select(ToDto));

    [HttpPost("planner")]
    public async Task<ActionResult<StaffingRequestDto>> CreatePlannerRequest(CreateStaffingRequestDto dto)
    {
        var request = new PlannerRequest
        {
            Department = dto.Department,
            Required_Count = dto.Required_Count,
            Details = dto.Details,
            Planner_ID = dto.Planner_ID,
            Status = "Pending"
        };
        context.PlannerRequests.Add(request);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPlannerRequest), new { id = request.Request_ID }, ToDto(request));
    }

    [HttpGet("planner/{id:int}")]
    public async Task<ActionResult<StaffingRequestDto>> GetPlannerRequest(int id)
    {
        var request = await context.PlannerRequests.FindAsync(id);
        return request is null ? NotFound() : Ok(ToDto(request));
    }

    [HttpPatch("planner/{id:int}/status")]
    public async Task<IActionResult> UpdatePlannerStatus(int id, UpdateStaffingRequestStatusDto dto) =>
        await UpdateStatus(context, context.PlannerRequests, id, dto.Status);

    private static async Task<IActionResult> UpdateStatus<TEntity>(BMEDbContext context, DbSet<TEntity> requests, int id, string status)
        where TEntity : class
    {
        var request = await requests.FindAsync(id);
        if (request is null) return new NotFoundResult();
        if (request is PORequest po) po.Status = status;
        if (request is PlannerRequest planner) planner.Status = status;
        await context.SaveChangesAsync();
        return new NoContentResult();
    }

    private static StaffingRequestDto ToDto(PORequest request) => new()
    {
        Request_ID = request.Request_ID, Department = request.Department, Required_Count = request.Required_Count,
        Details = request.Details, Status = request.Status, Planner_ID = request.Planner_ID, Created_At = request.Created_At
    };

    private static StaffingRequestDto ToDto(PlannerRequest request) => new()
    {
        Request_ID = request.Request_ID, Department = request.Department, Required_Count = request.Required_Count,
        Details = request.Details, Status = request.Status, Planner_ID = request.Planner_ID, Created_At = request.Created_At
    };
}
