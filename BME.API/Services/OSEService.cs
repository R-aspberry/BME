using Microsoft.EntityFrameworkCore;
using BME.API.Data;
using BME.API.DTOs;
using BME.API.Models;

namespace BME.API.Services;

public class OSEService
{
    private readonly BMEDbContext _context;

    public OSEService(BMEDbContext context)
    {
        _context = context;
    }

    public async Task<List<OSEDto>> GetAllAsync()
    {
        return await _context.OSE.Select(ose => new OSEDto
        {
            OSE_ID = ose.OSE_ID,
            FN = ose.FN,
            LN = ose.LN,
            Vendor = ose.Vendor,
            Email = ose.Email,
            Status = ose.Status,
            Planner_ID = ose.Planner_ID,
            Interviewer_ID = ose.Interviewer_ID,
            User_ID = ose.User_ID,
            EMP_ID = ose.EMP_ID,
            Phone = ose.Phone
        }).ToListAsync();
    }

    public async Task<OSEDto?> GetByIdAsync(int oseId)
    {
        return await _context.OSE
            .Where(ose => ose.OSE_ID == oseId)
            .Select(ose => new OSEDto
            {
                OSE_ID = ose.OSE_ID,
                FN = ose.FN,
                LN = ose.LN,
                Vendor = ose.Vendor,
                Email = ose.Email,
                Status = ose.Status,
                Planner_ID = ose.Planner_ID,
                Interviewer_ID = ose.Interviewer_ID,
                User_ID = ose.User_ID,
                EMP_ID = ose.EMP_ID,
                Phone = ose.Phone
            })
            .FirstOrDefaultAsync();
    }

    public async Task<OSEDto> CreateAsync(CreateOSEDto createOSEDto)
    {
        var ose = new OSE
        {
            OSE_ID = createOSEDto.OSE_ID,
            FN = createOSEDto.FN,
            LN = createOSEDto.LN,
            Vendor = createOSEDto.Vendor,
            Email = createOSEDto.Email,
            Status = createOSEDto.Status,
            Planner_ID = createOSEDto.Planner_ID,
            Interviewer_ID = createOSEDto.Interviewer_ID,
            User_ID = createOSEDto.User_ID,
            EMP_ID = createOSEDto.EMP_ID,
            Phone = createOSEDto.Phone
        };

        _context.OSE.Add(ose);
        await _context.SaveChangesAsync();
        return new OSEDto
        {
            OSE_ID = ose.OSE_ID,
            FN = ose.FN,
            LN = ose.LN,
            Vendor = ose.Vendor,
            Email = ose.Email,
            Status = ose.Status,
            Planner_ID = ose.Planner_ID,
            Interviewer_ID = ose.Interviewer_ID,
            User_ID = ose.User_ID,
            EMP_ID = ose.EMP_ID,
            Phone = ose.Phone
        };
    }

   public async Task<OSEDto?> UpdateAsync(int id, UpdateOSEDto dto)
    {
        var ose = await _context.OSE
            .FindAsync(id);

        if (ose == null)
        {
            return null;
        }

        ose.OSE_ID = dto.OSE_ID;
        ose.FN = dto.FN;
        ose.LN = dto.LN;
        ose.Vendor = dto.Vendor;
        ose.Email = dto.Email;
        ose.Status = dto.Status;
        ose.Planner_ID = dto.Planner_ID;
        ose.Interviewer_ID = dto.Interviewer_ID;
        ose.User_ID = dto.User_ID;
        ose.EMP_ID = dto.EMP_ID;
        ose.Phone = dto.Phone;

        await _context.SaveChangesAsync();

        return new OSEDto
        {
            OSE_ID = ose.OSE_ID,
            FN = ose.FN,
            LN = ose.LN,
            Vendor = ose.Vendor,
            Email = ose.Email,
            Status = ose.Status,
            Planner_ID = ose.Planner_ID,
            Interviewer_ID = ose.Interviewer_ID,
            User_ID = ose.User_ID,
            EMP_ID = ose.EMP_ID,
            Phone = ose.Phone
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var ose = await _context.OSE.FindAsync(id);

        if (ose == null)
        {
            return false;
        }

        _context.OSE.Remove(ose);

        await _context.SaveChangesAsync();

        return true;
    }
}