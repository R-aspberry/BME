using Backend.DTOs;

namespace Backend.Services.Interfaces
{
    public interface IWorksOnService
    {
        Task<bool> ProjectExistsAsync(int projectId);
        Task<bool> EmployeeExistsAsync(int employeeId);

        Task<IEnumerable<EmployeeOnProjectDto>> GetEmployeesByProjectAsync(int projectId);
        Task<IEnumerable<ProjectForEmployeeDto>> GetProjectsByEmployeeAsync(int employeeId);

        Task<(AssignmentResult Result, WorksOnDto Created)> AssignEmployeeAsync(int projectId, int employeeId);
        Task<AssignmentResult> RemoveAssignmentAsync(int projectId, int employeeId);

        Task<bool> AssignmentExistsAsync(int projectId, int employeeId);
    }
}
