using Microsoft.EntityFrameworkCore;
using BME.API.Data;
using BME.API.DTOs;
using BME.API.Models;

namespace BME.API.Services;

public class ProjectService
{
    private readonly BMEDbContext _context;

    public ProjectService(BMEDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProjectDto>> GetAllAsync()
    {
        return await _context.Projects
            .Select(p => new ProjectDto
            {
                Prj_ID = p.Prj_ID,
                Project_Name = p.Project_Name,
                Flag = p.Flag,
                Status = p.Status,
                Description = p.Description,
                Budget = p.Budget,
                MVP = p.MVP,
                BRD = p.BRD,
                Start_date = p.Start_date,
                End_date = p.End_date,
                BO_ID = p.BO_ID
            })
            .ToListAsync();
    }

    public async Task<ProjectDto?> GetByIdAsync(int projectId)
    {
        return await _context.Projects
            .Where(p => p.Prj_ID == projectId)
            .Select(p => new ProjectDto
            {
                Prj_ID = p.Prj_ID,
                Project_Name = p.Project_Name,
                Flag = p.Flag,
                Status = p.Status,
                Description = p.Description,
                Budget = p.Budget,
                MVP = p.MVP,
                BRD = p.BRD,
                Start_date = p.Start_date,
                End_date = p.End_date,
                BO_ID = p.BO_ID
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectDto dto)
    {
        var project = new Project
        {
            Prj_ID = dto.Prj_ID,
            Project_Name = dto.Project_Name,
            Flag = dto.Flag,
            Status = dto.Status,
            Description = dto.Description,
            Budget = dto.Budget,
            MVP = dto.MVP,
            BRD = dto.BRD,
            Start_date = dto.Start_date,
            End_date = dto.End_date,
            BO_ID = dto.BO_ID
        };

        _context.Projects.Add(project);

        await _context.SaveChangesAsync();

        return new ProjectDto
        {
            Prj_ID = project.Prj_ID,
            Project_Name = project.Project_Name,
            Flag = project.Flag,
            Status = project.Status,
            Description = project.Description,
            Budget = project.Budget,
            MVP = project.MVP,
            BRD = project.BRD,
            Start_date = project.Start_date,
            End_date = project.End_date,
            BO_ID = project.BO_ID
        };
    }

    public async Task<ProjectDto?> UpdateAsync(
        int id,
        UpdateProjectDto dto)
    {
        var project = await _context.Projects
            .FindAsync(id);

        if (project == null)
        {
            return null;
        }

        project.Prj_ID = dto.Prj_ID;
        project.Project_Name = dto.Project_Name;
        project.Flag = dto.Flag;
        project.Status = dto.Status;
        project.Description = dto.Description;
        project.Budget = dto.Budget;
        project.MVP = dto.MVP;
        project.BRD = dto.BRD;
        project.Start_date = dto.Start_date;
        project.End_date = dto.End_date;
        project.BO_ID = dto.BO_ID;

        await _context.SaveChangesAsync();

        return new ProjectDto
        {
            Prj_ID = project.Prj_ID,
            Project_Name = project.Project_Name,
            Flag = project.Flag,
            Status = project.Status,
            Description = project.Description,
            Budget = project.Budget,
            MVP = project.MVP,
            BRD = project.BRD,
            Start_date = project.Start_date,
            End_date = project.End_date,
            BO_ID = project.BO_ID
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var project = await _context.Projects
            .FindAsync(id);

        if (project == null)
        {
            return false;
        }

        _context.Projects.Remove(project);

        await _context.SaveChangesAsync();

        return true;
    }
}