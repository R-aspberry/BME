using Microsoft.AspNetCore.Mvc;
using BME.API.DTOs;
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
        public async Task<ActionResult<List<ResourcePlannerDto>>> GetAll()
        {
            var planners = await _service.GetAllAsync();

            var result = planners.Select(p => new ResourcePlannerDto
            {
                PlannerId = p.PlannerId,
                Name = p.Name,
                Email = p.Email,
                Phone = p.Phone,
                UserId = p.UserId
            }).ToList();

            return Ok(result);
        }

        // GET: api/ResourcePlanner/1
        [HttpGet("{id}")]
        public async Task<ActionResult<ResourcePlannerDto>> GetById(int id)
        {
            var planner = await _service.GetByIdAsync(id);

            if (planner == null)
            {
                return NotFound();
            }

            var result = new ResourcePlannerDto
            {
                PlannerId = planner.PlannerId,
                Name = planner.Name,
                Email = planner.Email,
                Phone = planner.Phone,
                UserId = planner.UserId
            };

            return Ok(result);
        }

        // POST: api/ResourcePlanner
        [HttpPost]
        public async Task<ActionResult<ResourcePlannerDto>> Create(
            ResourcePlannerDto dto)
        {
            var planner = new ResourcePlanner
            {
                PlannerId = dto.PlannerId,
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                UserId = dto.UserId
            };

            var createdPlanner = await _service.CreateAsync(planner);

            var result = new ResourcePlannerDto
            {
                PlannerId = createdPlanner.PlannerId,
                Name = createdPlanner.Name,
                Email = createdPlanner.Email,
                Phone = createdPlanner.Phone,
                UserId = createdPlanner.UserId
            };

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.PlannerId },
                result);
        }

        // PUT: api/ResourcePlanner/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            ResourcePlannerDto dto)
        {
            var planner = new ResourcePlanner
            {
                PlannerId = dto.PlannerId,
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                UserId = dto.UserId
            };

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