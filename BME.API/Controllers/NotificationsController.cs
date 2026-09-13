using Microsoft.AspNetCore.Mvc;
using BME.API.Data;
using BME.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace BME.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly BMEDbContext _context;

    public NotificationsController(BMEDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<NotificationDto>>> Get()
    {
        // Simple notifications: projects with non-empty Flag produce notifications
        var notifications = await _context.Projects
            .Where(p => !string.IsNullOrEmpty(p.Flag))
            .Select(p => new NotificationDto(p.Prj_ID, $"Project {p.Project_Name} flagged: {p.Flag}", "info"))
            .ToListAsync();

        return Ok(notifications);
    }
}
