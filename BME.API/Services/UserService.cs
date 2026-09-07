using Microsoft.EntityFrameworkCore;
using BME.API.Data;
using BME.API.DTOs;
using BME.API.Models;

namespace BME.API.Services;

public class UserService
{
    private readonly BMEDbContext _context;

    public UserService(BMEDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserDto>> GetAllAsync()
    {
        return await _context.Users
            .Select(u => new UserDto
            {
                User_ID = u.User_ID,
                User_Name = u.User_Name
            })
            .ToListAsync();
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.User_ID == id);

        if (user == null)
        {
            return null;
        }

        return new UserDto
        {
            User_ID = user.User_ID,
            User_Name = user.User_Name
        };
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto)
    {
        var user = new User
        {
            User_ID = dto.User_ID,
            User_Name = dto.User_Name,
            PasswordHash = dto.PasswordHash
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return new UserDto
        {
            User_ID = user.User_ID,
            User_Name = user.User_Name
        };
    }

    public async Task<UserDto?> UpdateAsync(
        int id,
        UpdateUserDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.User_ID == id);

        if (user == null)
        {
            return null;
        }

        user.User_Name = dto.User_Name;
        user.PasswordHash = dto.PasswordHash;

        await _context.SaveChangesAsync();

        return new UserDto
        {
            User_ID = user.User_ID,
            User_Name = user.User_Name
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.User_ID == id);

        if (user == null)
        {
            return false;
        }

        _context.Users.Remove(user);

        await _context.SaveChangesAsync();

        return true;
    }
}