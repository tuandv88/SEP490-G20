using System.Collections.Generic;
using User.Domain.Models;
using Microsoft.EntityFrameworkCore;
namespace User.Application.Data
{
    public interface IApplicationDbContext
    {
        DbSet<PointHistory> PointHistories { get; }
        DbSet<LearningPath> LearningPaths { get; }
        DbSet<PathStep> PathSteps { get; }
        DbSet<NotificationHistory> NotificationHistories { get; }
        DbSet<NotificationType> NotificationTypes { get; }
        DbSet<UserNotification> UserNotifications { get; }
        DbSet<UserGoal> UserGoals { get; }

        DbSet<TEntity> Set<TEntity>() where TEntity : class;

        Task AddAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class;
        void Update<T>(T entity) where T : class;
        void Remove<T>(T entity) where T : class;
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
