namespace Community.Application.Data.Repositories;

public interface INotificationHistoryRepository : IRepository<NotificationHistory>
{
    public Task<NotificationHistory?> GetByIdDetailAsync(Guid id);
}
