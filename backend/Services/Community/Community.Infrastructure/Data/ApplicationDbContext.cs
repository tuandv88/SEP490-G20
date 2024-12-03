using MassTransit;

namespace Community.Infrastructure.Data {
    public class ApplicationDbContext : DbContext, IApplicationDbContext {
        // DbSet Properties
        public DbSet<UserDiscussion> UserDiscussions => Set<UserDiscussion>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Discussion> Discussions => Set<Discussion>();
        public DbSet<Comment> Comments => Set<Comment>();
        public DbSet<Vote> Votes => Set<Vote>();
        public DbSet<Bookmark> Bookmarks => Set<Bookmark>();
        public DbSet<NotificationType> NotificationTypes => Set<NotificationType>();
        public DbSet<UserNotificationSetting> UserNotificationSettings => Set<UserNotificationSetting>();
        public DbSet<NotificationHistory> NotificationHistories => Set<NotificationHistory>();

        public DbSet<Flag> Flags => Set<Flag>();

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder builder) {
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(builder);

            builder.AddInboxStateEntity();
            builder.AddOutboxMessageEntity();
            builder.AddOutboxStateEntity();

        }
        public async new Task AddAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class {
            await Set<T>().AddAsync(entity, cancellationToken);
        }
        public new void Update<T>(T entity) where T : class {
            Set<T>().Update(entity);
        }
        public new void Remove<T>(T entity) where T : class {
            Set<T>().Remove(entity);
        }
    }
}
