namespace TaskTracker.Models.Dtos
{
    public class CreateTaskRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Priority { get; set; } = "Medium";
        public string DueDate { get; set; } = string.Empty;
    }
}
