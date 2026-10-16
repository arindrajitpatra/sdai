using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TaskTracker.Controllers;
using TaskTracker.Data;
using TaskTracker.Models.Dtos;
using TaskTracker.Options;
using TaskTracker.Repositories;
using TaskTracker.Services;
using Xunit;

namespace TaskTracker.Tests
{
    public class TasksControllerTests
    {
        private TaskDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<TaskDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new TaskDbContext(options);
        }

        private IOptions<TaskTrackerOptions> GetMockOptions()
        {
            return Microsoft.Extensions.Options.Options.Create(new TaskTrackerOptions
            {
                MaxTitleLength = 50,
                MaxDescriptionLength = 500,
                PastDueDateDaysLimit = 365,
                FutureDueDateDaysLimit = 1825,
                DefaultPriority = "Medium"
            });
        }

        [Fact]
        public async Task GetTasks_ReturnsOkObjectResultWithApiResponse()
        {
            // Arrange
            using var db = GetInMemoryDbContext();
            var repo = new TaskRepository(db);
            var service = new TaskService(repo, GetMockOptions());
            var controller = new TasksController(service);

            // Act
            var actionResult = await controller.GetTasks();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var response = Assert.IsType<ApiResponse<IEnumerable<TaskDto>>>(okResult.Value);
            Assert.True(response.Success);
            Assert.NotNull(response.Data);
            Assert.Null(response.Error);
        }

        [Fact]
        public async Task CreateTask_InvalidData_ReturnsBadRequestWithApiErrorEnvelope()
        {
            // Arrange
            using var db = GetInMemoryDbContext();
            var repo = new TaskRepository(db);
            var service = new TaskService(repo, GetMockOptions());
            var controller = new TasksController(service);

            var invalidRequest = new CreateTaskRequest { Title = "" };

            // Act
            var actionResult = await controller.CreateTask(invalidRequest);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var response = Assert.IsType<ApiResponse<TaskDto>>(badRequestResult.Value);
            Assert.False(response.Success);
            Assert.Null(response.Data);
            Assert.NotNull(response.Error);
            Assert.Equal("VALIDATION_FAILED", response.Error.Code);
        }

        [Fact]
        public async Task DeleteTask_NonExistentId_ReturnsNotFoundWithApiErrorEnvelope()
        {
            // Arrange
            using var db = GetInMemoryDbContext();
            var repo = new TaskRepository(db);
            var service = new TaskService(repo, GetMockOptions());
            var controller = new TasksController(service);

            var nonExistentId = Guid.NewGuid();

            // Act
            var actionResult = await controller.DeleteTask(nonExistentId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(actionResult.Result);
            var response = Assert.IsType<ApiResponse<object>>(notFoundResult.Value);
            Assert.False(response.Success);
            Assert.NotNull(response.Error);
            Assert.Equal("TASK_NOT_FOUND", response.Error.Code);
        }
    }
}
