using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using BME.API.Data;
using BME.API.Models;
using BME.API.Services;
using BME.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
// Allow local frontend origins during development
builder.Services.AddCors(options =>
{
	options.AddPolicy(name: "LocalDev",
		policy => policy
			.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5176")
			.AllowAnyHeader()
			.AllowAnyMethod()
			.AllowCredentials());
});
builder.Services.AddDbContext<BMEDbContext>(options =>
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<EmployeeService>();
builder.Services.AddScoped<OSEService>();
builder.Services.AddScoped<ProjectService>();
builder.Services.AddScoped<BOService>();
builder.Services.AddScoped<DepartmentService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<IResourcePlannerService, ResourcePlannerService>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<IAuthService, AuthService>();

var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is required.");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
	options.TokenValidationParameters = new TokenValidationParameters
	{
		ValidateIssuerSigningKey = true,
		IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
		ValidateIssuer = true,
		ValidIssuer = builder.Configuration["Jwt:Issuer"],
		ValidateAudience = true,
		ValidAudience = builder.Configuration["Jwt:Audience"],
		ValidateLifetime = true,
		ClockSkew = TimeSpan.FromMinutes(1)
	};
});
builder.Services.AddAuthorization();

var app = builder.Build();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("LocalDev");
app.MapControllers();
app.Run();
