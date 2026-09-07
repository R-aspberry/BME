using BME.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BME.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BOsController : ControllerBase
    {
        private readonly BmeDbContext _context;

        public BOsController(BmeDbContext context)
        {
            _context = context;
        }

        // GET: api/BOs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bo>>> GetBOs()
        {
            return await _context.Bos.ToListAsync();
        }

        // GET: api/BOs/1
        [HttpGet("{id}")]
        public async Task<ActionResult<Bo>> GetBO(int id)
        {
            var bo = await _context.Bos.FindAsync(id);

            if (bo == null)
            {
                return NotFound();
            }

            return bo;
        }
    }
}