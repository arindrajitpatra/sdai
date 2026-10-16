using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Globalization;
using TaskTracker.Data;
using TaskTracker.Models.Dtos;
using TaskTracker.Options;
using TaskTracker.Repositories;
using TaskTracker.Services;
using Xunit;

namespace TaskTracker.Tests
{
    public class TaskServiceTests
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
        public async Task CreateTask_ValidInputs_ReturnsSuccessAndDto()
        {
            // Arrange
            using var db = GetInMemoryDbContext();
            var repo = new TaskRepository(db);
            var service = new TaskService(repo, GetMockOptions());

            var request = new CreateTaskRequest
            {
                Title = "Submit Q4 Budget Report",
                Description = "Prepare expense breakdown.",
                Priority = "High",
                DueDate = DateTime.UtcNow.AddDays(7).ToString("yyyy-MM-dd")
            };

            // Act
            var result = await service.CreateTaskAsync(request);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Data);
            Assert.Equal("Submit Q4 Budget Report", result.Data.Title);
            Assert.Equal("High", result.Data.Priority);
            Assert.Equal("Pending", result.Data.Status);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData(null)]
        public async Task CreateTask_EmptyOrWhitespaceTitle_ReturnsValidationFailed(string? title)
        {
            // Arrange
            using var db = GetInMemoryDbContext();
            var repo = new TaskRepository(db);
            var service = new TaskService(repo, GetMockOptions());

            var request = new CreateTaskRequest
            {
                Title = title!,
                DueDate = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-dd")
            };

            // Act
            var result = await service.CreateTaskAsync(request);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal("VALIDATION_FAILED", result.ErrorCode);
            Assert.Contains(result.ErrorDetails, e => e.Field == "title" && e.Issue.Contains("cannot be blank"));
        }

        [Fact]
        public async Task CreateTask_TitleExceeding50Chars_ReturnsValidationFailed()
        {
            // Arrange
            using var db = GetInMemoryDbContext();
            var repo = new TaskRepository(db);
            var service = new TaskService(repo, GetMockOptions());

            var request = new CreateTaskRequest
            {
                Title = new string('A', 51),
                DueDate = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-dd")
            };

            // Act
            var result = await service.CreateTaskAsync(request);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal("VALIDATION_FAILED", result.ErrorCode);
            Assert.Contains(result.ErrorDetails, e => e.Field == "title" && e.Issue.Contains("cannot exceed 50"));
        }

        [Fact]
        public async Task CreateTask_DescriptionExceeding500Chars_ReturnsValidationFailed()
        {
            // Arrange
            using var db = GetInMemoryDbContext();
            var repo = new TaskRepository(db);
            var service = new TaskService(repo, GetMockOptions());

            var request = new CreateTaskRequest
            {
                Title = "Valid Title",
                Description = new string('D', 501),
                DueDate = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-dd")
            };

            // Act
            var result = await service.CreateTaskAsync(request);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal("VALIDATION_FAILED", result.ErrorCode);
            Assert.Contains(result.ErrorDetails, e => e.Field == "description" && e.Issue.Contains("cannot exceed 500"));
        }

        [Fact]
        public async Task CreateTask_DueDateMoreThan365DaysInPast_ReturnsValidationFailed()
        {
            // Arrange
            using var db = GetInMemoryDbContext();
            var repo = new TaskRepository(db);
            var service = new TaskService(repo, GetMockOptions());

            var invalidPastDate = DateTime.UtcNow.Date.AddDays(-366).ToString("yyyy-MM-dd");
            var request = new CreateTaskRequest
            {
                Title = "Past Task",
                DueDate = invalidPastDate
            };

            // Act
            var result = await service.CreateTaskAsync(request);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal("VALIDATION_FAILED", result.ErrorCode);
            Assert.Contains(result.ErrorDetails, e => e.Field == "dueDate" && e.Issue.Contains("between 1 year in the past"));
        }

        [Fact]
        public async Task CreateTask_DueDateMoreThan1825DaysInFuture_ReturnsValidationFailed()
        {
            // Arrange
            using var db = GetInMemoryDbContext();
            var repo = new TaskRepository(db);
            var service = new TaskService(repo, GetMockOptions());

            var invalidFutureDate = DateTime.UtcNow.Date.AddDays(1826).ToString("yyyy-MM-dd");
            var request = new CreateTaskRequest
            {
                Title = "Future Task",
                DueDate = invalidFutureDate
            };

            // Act
            var result = await service.CreateTaskAsync(request);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal("VALIDATION_FAILED", result.ErrorCode);
            Assert.Contains(result.ErrorDetails, e => e.Field == "dueDate" && e.Issue.Contains("5 years in the future"));
        }

        [Fact]
        public async Task UpdateTaskStatus_ValidStatus_UpdatesStatusSuccessfully()
        {
            // Arrange
            using var db = GetInMemoryDbContext();
            var repo = new TaskRepository(db);
            var service = new TaskService(repo, GetMockOptions());

            var createResult = await service.CreateTaskAsync(new CreateTaskRequest
            {
                Title = "Task to Toggle",
                DueDate = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-dd")
            });

            var taskId = createResult.Data!.Id;

            // Act
            var updateResult = await service.UpdateTaskStatusAsync(taskId, new UpdateTaskStatusRequest { Status = "Completed" });

            // Assert
            Assert.True(updateResult.IsSuccess);
            Assert.Equal("Completed", updateResult.Data!.Status);
        }

        [Fact]
        public async Task DeleteTask_ExistingTask_RemovesTaskFromDatabase()
        {
            // Arrange
            using var db = GetInMemoryDbContext();
            var repo = new TaskRepository(db);
            var service = new TaskService(repo, GetMockOptions());

            var createResult = await service.CreateTaskAsync(new CreateTaskRequest
            {
                Title = "Task to Delete",
                DueDate = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-dd")
            });

            var taskId = createResult.Data!.Id;

            // Act
            var deleteResult = await service.DeleteTaskAsync(taskId);

            // Assert
            Assert.True(deleteResult.IsSuccess);

            var getResult = await service.GetTaskByIdAsync(taskId);
            Assert.False(getResult.IsSuccess);
            Assert.Equal("TASK_NOT_FOUND", getResult.ErrorCode);
        }
    }
}
