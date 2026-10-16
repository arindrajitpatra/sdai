using Microsoft.Extensions.Options;
using System.Globalization;
using TaskTracker.Models.Dtos;
using TaskTracker.Models.Entities;
using TaskTracker.Options;
using TaskTracker.Repositories;

namespace TaskTracker.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repository;
        private readonly TaskTrackerOptions _options;

        public TaskService(ITaskRepository repository, IOptions<TaskTrackerOptions> options)
        {
            _repository = repository;
            _options = options.Value;
        }

        public async Task<TaskServiceResult<IEnumerable<TaskDto>>> GetAllTasksAsync(string? status = null, string? search = null)
        {
            var tasks = await _repository.GetAllAsync(status, search);
            var dtos = tasks.Select(MapToDto);
            return TaskServiceResult<IEnumerable<TaskDto>>.Success(dtos);
        }

        public async Task<TaskServiceResult<TaskDto>> GetTaskByIdAsync(Guid id)
        {
            var task = await _repository.GetByIdAsync(id);
            if (task == null)
            {
                return TaskServiceResult<TaskDto>.Failure("TASK_NOT_FOUND", $"Task with ID '{id}' was not found.");
            }
            return TaskServiceResult<TaskDto>.Success(MapToDto(task));
        }

        public async Task<TaskServiceResult<TaskDto>> CreateTaskAsync(CreateTaskRequest request)
        {
            var details = new List<ApiErrorDetail>();

            // Title validation (BR-02, BR-06, EC-01)
            var trimmedTitle = request.Title?.Trim();
            if (string.IsNullOrEmpty(trimmedTitle))
            {
                details.Add(new ApiErrorDetail { Field = "title", Issue = "Task title cannot be blank." });
            }
            else if (trimmedTitle.Length > _options.MaxTitleLength)
            {
                details.Add(new ApiErrorDetail { Field = "title", Issue = $"Task title cannot exceed {_options.MaxTitleLength} characters." });
            }

            // Description validation (BR-02, BR-06, EC-02)
            if (!string.IsNullOrEmpty(request.Description) && request.Description.Length > _options.MaxDescriptionLength)
            {
                details.Add(new ApiErrorDetail { Field = "description", Issue = $"Description cannot exceed {_options.MaxDescriptionLength} characters." });
            }

            // Priority validation
            var priority = string.IsNullOrWhiteSpace(request.Priority) ? _options.DefaultPriority : request.Priority.Trim();
            var validPriorities = new[] { "Low", "Medium", "High" };
            if (!validPriorities.Contains(priority, StringComparer.OrdinalIgnoreCase))
            {
                details.Add(new ApiErrorDetail { Field = "priority", Issue = "Priority must be 'Low', 'Medium', or 'High'." });
            }
            else
            {
                priority = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(priority.ToLower());
            }

            // Due Date validation (BR-07, EC-03)
            DateTime parsedDate = DateTime.MinValue;
            if (string.IsNullOrWhiteSpace(request.DueDate) || !DateTime.TryParseExact(request.DueDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out parsedDate))
            {
                details.Add(new ApiErrorDetail { Field = "dueDate", Issue = "Due date must be formatted in ISO YYYY-MM-DD date format." });
            }
            else
            {
                var today = DateTime.UtcNow.Date;
                var minDate = today.AddDays(-_options.PastDueDateDaysLimit);
                var maxDate = today.AddDays(_options.FutureDueDateDaysLimit);

                if (parsedDate < minDate || parsedDate > maxDate)
                {
                    details.Add(new ApiErrorDetail { Field = "dueDate", Issue = "Due date must be between 1 year in the past and 5 years in the future." });
                }
            }

            if (details.Count > 0)
            {
                return TaskServiceResult<TaskDto>.Failure("VALIDATION_FAILED", "Task creation failed due to invalid input fields.", details);
            }

            var entity = new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = trimmedTitle!,
                Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
                Priority = priority,
                DueDate = parsedDate,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var created = await _repository.CreateAsync(entity);
            return TaskServiceResult<TaskDto>.Success(MapToDto(created));
        }

        public async Task<TaskServiceResult<TaskDto>> UpdateTaskStatusAsync(Guid id, UpdateTaskStatusRequest request)
        {
            var task = await _repository.GetByIdAsync(id);
            if (task == null)
            {
                return TaskServiceResult<TaskDto>.Failure("TASK_NOT_FOUND", $"Task with ID '{id}' was not found.");
            }

            var validStatuses = new[] { "Pending", "Completed" };
            var newStatus = request.Status?.Trim();
            if (string.IsNullOrEmpty(newStatus) || !validStatuses.Contains(newStatus, StringComparer.OrdinalIgnoreCase))
            {
                return TaskServiceResult<TaskDto>.Failure("VALIDATION_FAILED", "Task status must be 'Pending' or 'Completed'.", new List<ApiErrorDetail>
                {
                    new ApiErrorDetail { Field = "status", Issue = "Status must be 'Pending' or 'Completed'." }
                });
            }

            task.Status = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(newStatus.ToLower());
            task.UpdatedAt = DateTime.UtcNow;

            var updated = await _repository.UpdateAsync(task);
            return TaskServiceResult<TaskDto>.Success(MapToDto(updated!));
        }

        public async Task<TaskServiceResult<object>> DeleteTaskAsync(Guid id)
        {
            var deleted = await _repository.DeleteAsync(id);
            if (!deleted)
            {
                return TaskServiceResult<object>.Failure("TASK_NOT_FOUND", $"Task with ID '{id}' was not found.");
            }

            return TaskServiceResult<object>.Success(new { id = id.ToString(), message = "Task permanently deleted." });
        }

        private static TaskDto MapToDto(TaskItem task)
        {
            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Priority = task.Priority,
                DueDate = task.DueDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                Status = task.Status,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt
            };
        }
    }
}
