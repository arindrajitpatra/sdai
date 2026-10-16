namespace TaskTracker.Options
{
    public class TaskTrackerOptions
    {
        public const string SectionName = "TaskTracker";

        public int MaxTitleLength { get; set; } = 50;
        public int MaxDescriptionLength { get; set; } = 500;
        public int PastDueDateDaysLimit { get; set; } = 365;
        public int FutureDueDateDaysLimit { get; set; } = 1825;
        public string DefaultPriority { get; set; } = "Medium";
        public string ConnectionString { get; set; } = string.Empty;
    }
}
