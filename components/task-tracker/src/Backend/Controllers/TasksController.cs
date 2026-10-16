using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskTracker.Models.Dtos;
using TaskTracker.Services;

namespace TaskTracker.Controllers
{
    [ApiController]
    [Route("api/v1/tasks")]
    [Produces("application/json")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        /// <summary>
        /// Retrieves all task items with optional status filtering and title search.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TaskDto>>), StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<IEnumerable<TaskDto>>>> GetTasks([FromQuery] string? status = null, [FromQuery] string? search = null)
        {
            var result = await _taskService.GetAllTasksAsync(status, search);
            return Ok(ApiResponse<IEnumerable<TaskDto>>.Ok(result.Data!));
        }

        /// <summary>
        /// Retrieves a specific task item by ID.
        /// </summary>
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(ApiResponse<TaskDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<TaskDto>), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<TaskDto>>> GetTaskById(Guid id)
        {
            var result = await _taskService.GetTaskByIdAsync(id);
            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<TaskDto>.Fail(result.ErrorCode, result.ErrorMessage, result.ErrorDetails));
            }
            return Ok(ApiResponse<TaskDto>.Ok(result.Data!));
        }

        /// <summary>
        /// Creates a new task item.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<TaskDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse<TaskDto>), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ApiResponse<TaskDto>>> CreateTask([FromBody] CreateTaskRequest request)
        {
            var result = await _taskService.CreateTaskAsync(request);
            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<TaskDto>.Fail(result.ErrorCode, result.ErrorMessage, result.ErrorDetails));
            }
            return CreatedAtAction(nameof(GetTaskById), new { id = result.Data!.Id }, ApiResponse<TaskDto>.Ok(result.Data!));
        }

        /// <summary>
        /// Toggles or sets task status (Pending <-> Completed).
        /// </summary>
        [HttpPatch("{id:guid}/status")]
        [ProducesResponseType(typeof(ApiResponse<TaskDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<TaskDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<TaskDto>), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<TaskDto>>> UpdateTaskStatus(Guid id, [FromBody] UpdateTaskStatusRequest request)
        {
            var result = await _taskService.UpdateTaskStatusAsync(id, request);
            if (!result.IsSuccess)
            {
                if (result.ErrorCode == "TASK_NOT_FOUND")
                {
                    return NotFound(ApiResponse<TaskDto>.Fail(result.ErrorCode, result.ErrorMessage, result.ErrorDetails));
                }
                return BadRequest(ApiResponse<TaskDto>.Fail(result.ErrorCode, result.ErrorMessage, result.ErrorDetails));
            }
            return Ok(ApiResponse<TaskDto>.Ok(result.Data!));
        }

        /// <summary>
        /// Permanently removes a task item.
        /// </summary>
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<object>>> DeleteTask(Guid id)
        {
            var result = await _taskService.DeleteTaskAsync(id);
            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<object>.Fail(result.ErrorCode, result.ErrorMessage, result.ErrorDetails));
            }
            return Ok(ApiResponse<object>.Ok(result.Data!));
        }
    }
}
