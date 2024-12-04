using MassTransit;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

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

            // Tự động chuyển đổi tất cả DateTime thành UTC
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(new ValueConverter<DateTime, DateTime>(
                            v => v.ToUniversalTime(), // Khi lưu, chuyển thành UTC
                            v => DateTime.SpecifyKind(v, DateTimeKind.Utc) // Khi lấy dữ liệu, đặt DateTimeKind thành UTC
                        ));
                    }
                }
            }

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
