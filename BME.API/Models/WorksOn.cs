using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class WorksOn
    {
        public int Employee_ID { get; set; }
        public int Prj_ID { get; set; }

        [ForeignKey("Employee_ID")]
        public Employee Employee { get; set; }

        [ForeignKey("Prj_ID")]
        public Project Project { get; set; }
    }
}
