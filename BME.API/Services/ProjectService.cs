using BME.Backend.DTOs;
using BME.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace BME.Backend.Services;

public class ProjectService
{
    private readonly BmeDbContext _context;

    public ProjectService(BmeDbContext context)
    {
        _context = context;
    }

    // GET ALL PROJECTS
    public async Task<List<ProjectDto>> GetAllProjectsAsync()
    {
        return await _context.Projects
            .Include(p => p.Bo)
            .Select(p => new ProjectDto
            {
                PrjId = p.PrjId,
                ProjectName = p.ProjectName,
                Flag = p.Flag,
                Status = p.Status,
                Description = p.Description,
                Budget = p.Budget,
                Mvp = p.Mvp,
                Brd = p.Brd,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                BoId = p.BoId,
                BusinessOwnerName = p.Bo != null ? p.Bo.Name : null
            })
            .ToListAsync();
    }

    // GET PROJECT BY ID
    public async Task<ProjectDto?> GetProjectByIdAsync(int id)
    {
        return await _context.Projects
            .Include(p => p.Bo)
            .Where(p => p.PrjId == id)
            .Select(p => new ProjectDto
            {
                PrjId = p.PrjId,
                ProjectName = p.ProjectName,
                Flag = p.Flag,
                Status = p.Status,
                Description = p.Description,
                Budget = p.Budget,
                Mvp = p.Mvp,
                Brd = p.Brd,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                BoId = p.BoId,
                BusinessOwnerName = p.Bo != null ? p.Bo.Name : null
            })
            .FirstOrDefaultAsync();
    }

    // CREATE PROJECT
    public async Task<ProjectDto?> CreateProjectAsync(CreateProjectDto dto)
    {
        // Check if Business Owner exists
        if (dto.BoId.HasValue)
        {
            var businessOwnerExists = await _context.Bos
                .AnyAsync(b => b.BoId == dto.BoId.Value);

            if (!businessOwnerExists)
            {
                return null;
            }
        }

        var project = new Project
        {
            ProjectName = dto.ProjectName,
            Flag = dto.Flag,
            Status = dto.Status,
            Description = dto.Description,
            Budget = dto.Budget,
            Mvp = dto.Mvp,
            Brd = dto.Brd,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            BoId = dto.BoId
        };

        _context.Projects.Add(project);

        await _context.SaveChangesAsync();

        return await GetProjectByIdAsync(project.PrjId);
    }

    // UPDATE PROJECT
    public async Task<ProjectDto?> UpdateProjectAsync(
        int id,
        UpdateProjectDto dto)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.PrjId == id);

        if (project == null)
        {
            return null;
        }

        // Check if Business Owner exists
        if (dto.BoId.HasValue)
        {
            var businessOwnerExists = await _context.Bos
                .AnyAsync(b => b.BoId == dto.BoId.Value);

            if (!businessOwnerExists)
            {
                return null;
            }
        }

        project.ProjectName = dto.ProjectName;
        project.Flag = dto.Flag;
        project.Status = dto.Status;
        project.Description = dto.Description;
        project.Budget = dto.Budget;
        project.Mvp = dto.Mvp;
        project.Brd = dto.Brd;
        project.StartDate = dto.StartDate;
        project.EndDate = dto.EndDate;
        project.BoId = dto.BoId;

        await _context.SaveChangesAsync();

        return await GetProjectByIdAsync(id);
    }

    // DELETE PROJECT
    public async Task<bool> DeleteProjectAsync(int id)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.PrjId == id);

        if (project == null)
        {
            return false;
        }

        _context.Projects.Remove(project);

        await _context.SaveChangesAsync();

        return true;
    }
}