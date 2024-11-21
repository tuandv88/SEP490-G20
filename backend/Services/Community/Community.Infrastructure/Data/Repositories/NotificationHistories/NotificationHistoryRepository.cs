namespace Community.Infrastructure.Data.Repositories.NotificationHistories;
public class NotificationHistoryRepository : Repository<NotificationHistory>, INotificationHistoryRepository
{
    private readonly IApplicationDbContext _dbContext;
    public NotificationHistoryRepository(IApplicationDbContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException();
    }

    public override async Task DeleteByIdAsync(Guid id)
    {
        var notificationHistory = await GetByIdAsync(id);
        if (notificationHistory != null)
        {
            _dbContext.NotificationHistories.Remove(notificationHistory);
        }
    }

    public override async Task<NotificationHistory?> GetByIdAsync(Guid id)
    {
        var notificationHistory = _dbContext.NotificationHistories
                        .AsEnumerable()
                        .FirstOrDefault(c => c.Id.Value == id);
        return notificationHistory;
    }

    public async Task<NotificationHistory?> GetByIdDetailAsync(Guid id)
    {
        return null;
    }
}
