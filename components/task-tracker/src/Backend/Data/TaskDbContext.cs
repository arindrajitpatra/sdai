using Microsoft.EntityFrameworkCore;
using TaskTracker.Models.Entities;

namespace TaskTracker.Data
{
    public class TaskDbContext : DbContext
    {
        public TaskDbContext(DbContextOptions<TaskDbContext> options) : base(options)
        {
        }

        public DbSet<TaskItem> Tasks => Set<TaskItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TaskItem>(entity =>
            {
                entity.ToTable("tasks");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Title).HasColumnName("title").HasMaxLength(50).IsRequired();
                entity.Property(e => e.Description).HasColumnName("description").HasMaxLength(500);
                entity.Property(e => e.Priority).HasColumnName("priority").HasMaxLength(10).HasDefaultValue("Medium");
                entity.Property(e => e.DueDate).HasColumnName("due_date").IsRequired();
                entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(15).HasDefaultValue("Pending");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").IsRequired();

                entity.HasIndex(e => new { e.Status, e.CreatedAt }, "idx_tasks_status_created_at");
                entity.HasIndex(e => e.Title, "idx_tasks_title");
            });
        }
    }
}
