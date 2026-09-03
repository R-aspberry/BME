namespace Backend.DTOs
{
    // Used as the response body when an assignment is successfully created
    public class WorksOnDto
    {
        public int Employee_ID { get; set; }
        public int Prj_ID { get; set; }
    }

    public class EmployeeOnProjectDto
    {
        public int Employee_ID { get; set; }
        public string FullName { get; set; }
        public string Title { get; set; }
    }

    public class ProjectForEmployeeDto
    {
        public int Prj_ID { get; set; }
        public string Project_Name { get; set; }
        public string Status { get; set; }
    }
}
