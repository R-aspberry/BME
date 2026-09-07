using Microsoft.AspNetCore.Mvc;
using BME.API.DTOs;
using BME.API.Services;

namespace BME.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BOController : ControllerBase
{
    private readonly BOService _boService;

    public BOController(BOService boService)
    {
        _boService = boService;
    }

    [HttpGet]
    public async Task<ActionResult> GetBOs()
    {
        var boDtos = await _boService.GetAllAsync();

        return Ok(boDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetBO(int id)
    {
        var boDto = await _boService.GetByIdAsync(id);

        if (boDto == null)
        {
            return NotFound();
        }

        return Ok(boDto);
    }

    [HttpPost]
    public async Task<IActionResult> CreateBO(
        CreateBODto dto)
    {
        var bo = await _boService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetBO),
            new { id = bo.BO_ID },
            bo);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBO(
        int id,
        UpdateBODto dto)
    {
        var bo = await _boService.UpdateAsync(id, dto);

        if (bo == null)
        {
            return NotFound();
        }

        return Ok(bo);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBO(int id)
    {
        var deleted = await _boService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}