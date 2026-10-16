using TaskTracker.Models.Dtos;

namespace TaskTracker.Services
{
    public class TaskServiceResult<T>
    {
        public bool IsSuccess { get; set; }
        public T? Data { get; set; }
        public string ErrorCode { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;
        public List<ApiErrorDetail> ErrorDetails { get; set; } = new();

        public static TaskServiceResult<T> Success(T data) => new TaskServiceResult<T> { IsSuccess = true, Data = data };
        public static TaskServiceResult<T> Failure(string code, string message, List<ApiErrorDetail>? details = null) =>
            new TaskServiceResult<T>
            {
                IsSuccess = false,
                Data = default,
                ErrorCode = code,
                ErrorMessage = message,
                ErrorDetails = details ?? new List<ApiErrorDetail>()
            };
    }

    public interface ITaskService
    {
        Task<TaskServiceResult<IEnumerable<TaskDto>>> GetAllTasksAsync(string? status = null, string? search = null);
        Task<TaskServiceResult<TaskDto>> GetTaskByIdAsync(Guid id);
        Task<TaskServiceResult<TaskDto>> CreateTaskAsync(CreateTaskRequest request);
        Task<TaskServiceResult<TaskDto>> UpdateTaskStatusAsync(Guid id, UpdateTaskStatusRequest request);
        Task<TaskServiceResult<object>> DeleteTaskAsync(Guid id);
    }
}
