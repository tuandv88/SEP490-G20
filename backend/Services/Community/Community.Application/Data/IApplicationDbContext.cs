namespace Community.Application.Data
{
    public interface IApplicationDbContext
    {
        DbSet<UserDiscussion> UserDiscussions { get; }
        DbSet<Category> Categories { get; }
        DbSet<Discussion> Discussions { get; }
        DbSet<Comment> Comments { get; }
        DbSet<Vote> Votes { get; }
        DbSet<Bookmark> Bookmarks { get; }
        DbSet<NotificationType> NotificationTypes { get; }
        DbSet<UserNotificationSetting> UserNotificationSettings { get; }
        DbSet<NotificationHistory> NotificationHistories { get; }
        DbSet<Flag> Flags { get; }
        DbSet<TEntity> Set<TEntity>() where TEntity : class;

        Task AddAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class;
        void Update<T>(T entity) where T : class;
        void Remove<T>(T entity) where T : class;
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}

