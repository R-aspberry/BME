using AutoMapper;
using BME.API.Data;
using BME.API.DTOs;
using BME.API.Exceptions;
using BME.API.Models;
using BME.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BME.API.Services;

public class ResourcePlannerService : IResourcePlannerService
{
    private readonly ResourceAllocationDbContext _context;
    private readonly IMapper _mapper;

    public ResourcePlannerService(ResourceAllocationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ResourcePlannerDto>> GetAllAsync()
    {
        var planners = await _context.ResourcePlanners.AsNoTracking().ToListAsync();
        return _mapper.Map<IEnumerable<ResourcePlannerDto>>(planners);
    }

    public async Task<ResourcePlannerDto> GetByIdAsync(int id)
    {
        var planner = await _context.ResourcePlanners.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new NotFoundException($"Resource planner with id {id} was not found.");

        return _mapper.Map<ResourcePlannerDto>(planner);
    }

    public async Task<ResourcePlannerDto> CreateAsync(ResourcePlannerDto dto)
    {
        var planner = _mapper.Map<ResourcePlanner>(dto);
        _context.ResourcePlanners.Add(planner);
        await _context.SaveChangesAsync();

        return _mapper.Map<ResourcePlannerDto>(planner);
    }

    public async Task<ResourcePlannerDto> UpdateAsync(int id, ResourcePlannerDto dto)
    {
        var planner = await _context.ResourcePlanners.FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new NotFoundException($"Resource planner with id {id} was not found.");

        planner.EmployeeId = dto.EmployeeId;
        planner.ProjectId = dto.ProjectId;
        planner.WeekStart = dto.WeekStart;
        planner.AllocationPercent = dto.AllocationPercent;
        planner.Notes = dto.Notes;

        await _context.SaveChangesAsync();
        return _mapper.Map<ResourcePlannerDto>(planner);
    }

    public async Task DeleteAsync(int id)
    {
        var planner = await _context.ResourcePlanners.FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new NotFoundException($"Resource planner with id {id} was not found.");

        _context.ResourcePlanners.Remove(planner);
        await _context.SaveChangesAsync();
    }
}
