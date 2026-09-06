namespace BME.API.DTOs
{
    public class ResourcePlannerDto
    {
        public int PlannerId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public int? UserId { get; set; }
    }
}