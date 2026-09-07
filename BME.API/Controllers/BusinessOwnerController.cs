using BME.Backend.DTOs;
using BME.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BME.Backend.Controllers;

[ApiController]
[Route("api/businessowners")]
public class BusinessOwnerController : ControllerBase
{
    private readonly BmeDbContext _context;

    public BusinessOwnerController(BmeDbContext context)
    {
        _context = context;
    }

    // GET: /api/businessowners
    [HttpGet]
    public async Task<IActionResult> GetBusinessOwners()
    {
        var businessOwners = await _context.Bos
            .Select(b => new BusinessOwnerDto
            {
                BoId = b.BoId,
                Name = b.Name,
                BusinessArea = b.BusinessArea,
                Email = b.Email,
                Phone = b.Phone,
                UserId = b.UserId
            })
            .ToListAsync();

        return Ok(businessOwners);
    }
}