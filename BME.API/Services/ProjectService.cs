using AutoMapper;
using BME.API.Data;
using BME.API.DTOs;
using BME.API.Exceptions;
using BME.API.Models;
using BME.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BME.API.Services;

public class ProjectService : IProjectService
{
    private readonly ResourceAllocationDbContext _context;
    private readonly IMapper _mapper;

    public ProjectService(ResourceAllocationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProjectDto>> GetAllAsync()
    {
        var projects = await _context.Projects.AsNoTracking().ToListAsync();
        return _mapper.Map<IEnumerable<ProjectDto>>(projects);
    }

    public async Task<ProjectDto> GetByIdAsync(int id)
    {
        var project = await _context.Projects.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new NotFoundException($"Project with id {id} was not found.");

        return _mapper.Map<ProjectDto>(project);
    }

    public async Task<ProjectDto> CreateAsync(ProjectDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new BadRequestException("Project name is required.");
        }

        var project = _mapper.Map<Project>(dto);
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return _mapper.Map<ProjectDto>(project);
    }

    public async Task<ProjectDto> UpdateAsync(int id, ProjectDto dto)
    {
        var project = await _context.Projects.FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new NotFoundException($"Project with id {id} was not found.");

        project.Name = dto.Name;
        project.Description = dto.Description;
        project.Status = dto.Status;
        project.StartDate = dto.StartDate;
        project.EndDate = dto.EndDate;

        await _context.SaveChangesAsync();
        return _mapper.Map<ProjectDto>(project);
    }

    public async Task DeleteAsync(int id)
    {
        var project = await _context.Projects.FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new NotFoundException($"Project with id {id} was not found.");

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();
    }
}
