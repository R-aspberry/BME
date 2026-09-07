using BME.Backend.Models;
using BME.Backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Add database
builder.Services.AddDbContext<BmeDbContext>(options =>
    options.UseSqlServer(
        "Server=LAPTOP-UNVFC07F;Database=master;Trusted_Connection=True;TrustServerCertificate=True;"
    ));

// Register ProjectService
builder.Services.AddScoped<ProjectService>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Build application
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();