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
                Planner_ID = p.Planner_ID,
                Name = p.Name,
                Email = p.Email,
                Phone = p.Phone,
                User_ID = p.User_ID
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
                Planner_ID = planner.Planner_ID,
                Name = planner.Name,
                Email = planner.Email,
                Phone = planner.Phone,
                User_ID = planner.User_ID
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
                Planner_ID = dto.Planner_ID,
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                User_ID = dto.User_ID
            };

            var createdPlanner = await _service.CreateAsync(planner);

            var result = new ResourcePlannerDto
            {
                Planner_ID = createdPlanner.Planner_ID,
                Name = createdPlanner.Name,
                Email = createdPlanner.Email,
                Phone = createdPlanner.Phone,
                User_ID = createdPlanner.User_ID
            };

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.Planner_ID },
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
                Planner_ID = id,
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                User_ID = dto.User_ID
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