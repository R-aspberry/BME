using Microsoft.AspNetCore.Mvc;
using BME.API.Models;
using BME.API.Services.Interfaces;

namespace BME.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResourcePlannerController : ControllerBase
    {
        private readonly IResourcePlannerService _service;

        public ResourcePlannerController(IResourcePlannerService service)
        {
            _service = service;
        }

        // GET: api/ResourcePlanner
        [HttpGet]
        public async Task<ActionResult<List<ResourcePlanner>>> GetAll()
        {
            var planners = await _service.GetAllAsync();

            return Ok(planners);
        }

        // GET: api/ResourcePlanner/1
        [HttpGet("{id}")]
        public async Task<ActionResult<ResourcePlanner>> GetById(int id)
        {
            var planner = await _service.GetByIdAsync(id);

            if (planner == null)
            {
                return NotFound();
            }

            return Ok(planner);
        }

        // POST: api/ResourcePlanner
        [HttpPost]
        public async Task<ActionResult<ResourcePlanner>> Create(ResourcePlanner planner)
        {
            var createdPlanner = await _service.CreateAsync(planner);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdPlanner.PlannerId },
                createdPlanner);
        }

        // PUT: api/ResourcePlanner/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            ResourcePlanner planner)
        {
            var updated = await _service.UpdateAsync(id, planner);

            if (!updated)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/ResourcePlanner/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}