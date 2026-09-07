using Microsoft.EntityFrameworkCore;
using BME.API.Data;
using BME.API.Services;
using BME.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add controllers
builder.Services.AddControllers();

builder.Services.AddDbContext<BMEDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<EmployeeService>();

builder.Services.AddScoped<OSEService>();

builder.Services.AddScoped<IResourcePlannerService, ResourcePlannerService>();

var app = builder.Build();

app.UseHttpsRedirection();

app.MapControllers();

app.Run();