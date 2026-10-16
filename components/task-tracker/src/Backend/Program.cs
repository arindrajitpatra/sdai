using Microsoft.EntityFrameworkCore;
using TaskTracker.Data;
using TaskTracker.Options;
using TaskTracker.Repositories;
using TaskTracker.Services;

var builder = WebApplication.CreateBuilder(args);

// Strongly-typed options pattern (configurable-variables-guidelines)
builder.Services.Configure<TaskTrackerOptions>(
    builder.Configuration.GetSection(TaskTrackerOptions.SectionName));

// Register DbContext with In-Memory Database for local execution & testing
builder.Services.AddDbContext<TaskDbContext>(options =>
    options.UseInMemoryDatabase("TaskTrackerDb"));

// Dependency Injection registrations (dotnet-microservice-guidelines)
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseRouting();
app.UseAuthorization();
app.MapControllers();

app.Run();

// Partial Program class for WebApplicationFactory testing support
public partial class Program { }
