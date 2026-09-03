namespace Backend.Services
{
    // Lets the controller return the correct HTTP status code
    // instead of collapsing every failure into one generic response.
    public enum AssignmentResult
    {
        Success,
        ProjectNotFound,
        EmployeeNotFound,
        AlreadyAssigned,   // -> 409 Conflict
        AssignmentNotFound // -> 404 Not Found (used on delete)
    }
}
