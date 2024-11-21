namespace Community.Application.Data.Repositories;

public interface INotificationTypeRepository : IRepository<NotificationType>
{
    public Task<NotificationType?> GetByIdDetailAsync(Guid id);
}



