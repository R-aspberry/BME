using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BME.API.Data;
using BME.API.DTOs;
using BME.API.Services;

namespace BME.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OSEController : ControllerBase
{
    private readonly OSEService _oseService;    

    public OSEController(OSEService oseService)
    {
        _oseService = oseService;
    }

    [HttpGet]
    public async Task<ActionResult> GetOses()
    {
        var oseDtos = await _oseService.GetAllAsync();
        return Ok(oseDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetOSE(int id)
    {
        var oseDto = await _oseService.GetByIdAsync(id);
        if (oseDto == null)
        {
            return NotFound();
        }
        return Ok(oseDto);
    }


    [HttpPost]
    public async Task<IActionResult> CreateOse(CreateOSEDto dto)
    {
        var OSE = await _oseService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetOSE),
            new { id = OSE.OSE_ID },
            OSE);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOse(
        int id,
        UpdateOSEDto dto)
    {
        var OSE = await _oseService.UpdateAsync(id, dto);

        if (OSE == null)
        {
            return NotFound();
        }

        return Ok(OSE);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOse(int id)
    {
        var deleted = await _oseService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}