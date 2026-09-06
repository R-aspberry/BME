using Microsoft.EntityFrameworkCore;
using BME.API.Data;
using BME.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<BMEDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<EmployeeService>();

var app = builder.Build();

app.UseHttpsRedirection();

app.MapControllers();

app.Run();