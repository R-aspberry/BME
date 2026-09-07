using Microsoft.EntityFrameworkCore;
using BME.API.Data;
using BME.API.Services;
using BME.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Connect to SQL Server
builder.Services.AddDbContext<ResourceAllocationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Resource Planner service
builder.Services.AddScoped<IResourcePlannerService, ResourcePlannerService>();

// Add controllers
builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();

app.MapControllers();

app.Run();