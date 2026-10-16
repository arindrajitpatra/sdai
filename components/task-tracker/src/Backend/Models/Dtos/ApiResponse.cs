namespace TaskTracker.Models.Dtos
{
    public class ApiErrorDetail
    {
        public string Field { get; set; } = string.Empty;
        public string Issue { get; set; } = string.Empty;
    }

    public class ApiError
    {
        public string Code { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public List<ApiErrorDetail> Details { get; set; } = new();
    }

    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public ApiError? Error { get; set; }

        public static ApiResponse<T> Ok(T data) => new ApiResponse<T> { Success = true, Data = data, Error = null };
        public static ApiResponse<T> Fail(string code, string message, List<ApiErrorDetail>? details = null) =>
            new ApiResponse<T>
            {
                Success = false,
                Data = default,
                Error = new ApiError
                {
                    Code = code,
                    Message = message,
                    Details = details ?? new List<ApiErrorDetail>()
                }
            };
    }
}
