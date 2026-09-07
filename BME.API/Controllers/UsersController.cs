using Microsoft.AspNetCore.Mvc;
using BME.API.DTOs;
using BME.API.Services;

namespace BME.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;

    public UsersController(UserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userService.GetAllAsync();

        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _userService.GetByIdAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser(CreateUserDto dto)
    {
        var user = await _userService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetUser),
            new { id = user.User_ID },
            user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(
        int id,
        UpdateUserDto dto)
    {
        var user = await _userService.UpdateAsync(id, dto);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var deleted = await _userService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}