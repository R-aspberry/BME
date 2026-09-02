using AutoMapper;
using BME.API.Data;
using BME.API.DTOs;
using BME.API.Exceptions;
using BME.API.Models;
using BME.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BME.API.Services;

public class OSEService : IOSEService
{
    private readonly ResourceAllocationDbContext _context;
    private readonly IMapper _mapper;

    public OSEService(ResourceAllocationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<OSEDto>> GetAllAsync()
    {
        var oseItems = await _context.OseItems.AsNoTracking().ToListAsync();
        return _mapper.Map<IEnumerable<OSEDto>>(oseItems);
    }

    public async Task<OSEDto> GetByIdAsync(int id)
    {
        var oseItem = await _context.OseItems.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new NotFoundException($"OSE item with id {id} was not found.");

        return _mapper.Map<OSEDto>(oseItem);
    }

    public async Task<OSEDto> CreateAsync(OSEDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new BadRequestException("OSE item name is required.");
        }

        var oseItem = _mapper.Map<OSE>(dto);
        _context.OseItems.Add(oseItem);
        await _context.SaveChangesAsync();

        return _mapper.Map<OSEDto>(oseItem);
    }

    public async Task<OSEDto> UpdateAsync(int id, OSEDto dto)
    {
        var oseItem = await _context.OseItems.FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new NotFoundException($"OSE item with id {id} was not found.");

        oseItem.Name = dto.Name;
        oseItem.Description = dto.Description;
        oseItem.ProjectId = dto.ProjectId;
        oseItem.DepartmentId = dto.DepartmentId;
        oseItem.Status = dto.Status;

        await _context.SaveChangesAsync();
        return _mapper.Map<OSEDto>(oseItem);
    }

    public async Task DeleteAsync(int id)
    {
        var oseItem = await _context.OseItems.FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new NotFoundException($"OSE item with id {id} was not found.");

        _context.OseItems.Remove(oseItem);
        await _context.SaveChangesAsync();
    }
}
