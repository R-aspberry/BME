using Backend.Data;
using Backend.DTOs;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class WorksOnService : IWorksOnService
    {
        private readonly ResourceAllocationDbContext _context;

        public WorksOnService(ResourceAllocationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ProjectExistsAsync(int projectId) =>
            await _context.Projects.AnyAsync(p => p.Prj_ID == projectId);

        public async Task<bool> EmployeeExistsAsync(int employeeId) =>
            await _context.Employees.AnyAsync(e => e.ID == employeeId);

        public async Task<bool> AssignmentExistsAsync(int projectId, int employeeId) =>
            await _context.WorksOn.AnyAsync(w => w.Prj_ID == projectId && w.Employee_ID == employeeId);

        public async Task<IEnumerable<EmployeeOnProjectDto>> GetEmployeesByProjectAsync(int projectId)
        {
            return await _context.WorksOn
                .Where(w => w.Prj_ID == projectId)
                .Select(w => new EmployeeOnProjectDto
                {
                    Employee_ID = w.Employee.ID,
                    FullName = w.Employee.FN + " " + w.Employee.LN,
                    Title = w.Employee.Title
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<ProjectForEmployeeDto>> GetProjectsByEmployeeAsync(int employeeId)
        {
            return await _context.WorksOn
                .Where(w => w.Employee_ID == employeeId)
                .Select(w => new ProjectForEmployeeDto
                {
                    Prj_ID = w.Project.Prj_ID,
                    Project_Name = w.Project.Project_Name,
                    Status = w.Project.Status
                })
                .ToListAsync();
        }

        public async Task<(AssignmentResult Result, WorksOnDto Created)> AssignEmployeeAsync(int projectId, int employeeId)
        {
            if (!await ProjectExistsAsync(projectId))
                return (AssignmentResult.ProjectNotFound, null);

            if (!await EmployeeExistsAsync(employeeId))
                return (AssignmentResult.EmployeeNotFound, null);

            if (await AssignmentExistsAsync(projectId, employeeId))
                return (AssignmentResult.AlreadyAssigned, null);

            var entry = new Models.WorksOn { Prj_ID = projectId, Employee_ID = employeeId };
            _context.WorksOn.Add(entry);
            await _context.SaveChangesAsync();

            var dto = new WorksOnDto { Employee_ID = employeeId, Prj_ID = projectId };
            return (AssignmentResult.Success, dto);
        }

        public async Task<AssignmentResult> RemoveAssignmentAsync(int projectId, int employeeId)
        {
            var entry = await _context.WorksOn
                .FirstOrDefaultAsync(w => w.Prj_ID == projectId && w.Employee_ID == employeeId);

            if (entry == null)
                return AssignmentResult.AssignmentNotFound;

            _context.WorksOn.Remove(entry);
            await _context.SaveChangesAsync();
            return AssignmentResult.Success;
        }
    }
}
