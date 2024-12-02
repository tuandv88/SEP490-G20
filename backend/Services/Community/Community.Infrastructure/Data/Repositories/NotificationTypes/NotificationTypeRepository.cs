using Microsoft.EntityFrameworkCore;

namespace Community.Infrastructure.Data.Repositories.NotificationTypes;

public class NotificationTypeRepository : Repository<NotificationType>, INotificationTypeRepository
{
    private readonly IApplicationDbContext _dbContext;
    public NotificationTypeRepository(IApplicationDbContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException();
    }

    public override async Task DeleteByIdAsync(Guid id)
    {
        var notificationType = await GetByIdAsync(id);
        if (notificationType != null)
        {
            _dbContext.NotificationTypes.Remove(notificationType);
        }
    }

    public override async Task<NotificationType?> GetByIdAsync(Guid id)
    {
        var notificationType = _dbContext.NotificationTypes
                        .Include(nt => nt.NotificationHistorys)
                        .AsEnumerable()
                        .FirstOrDefault(c => c.Id.Value == id);
        return notificationType;
    }

    public async Task<NotificationType?> GetByIdDetailAsync(Guid id)
    {
        return null;
    }

    public async Task<List<NotificationType>> GetByIdsAsync(List<Guid> ids)
    {
        var notificationTypes = await _dbContext.NotificationTypes
                                              .ToListAsync();  // Đưa tất cả dữ liệu vào bộ nhớ

        return notificationTypes.Where(nt => ids.Contains(nt.Id.Value)).ToList();
    }

}
