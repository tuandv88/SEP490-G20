namespace Community.Application.Data.Repositories;

public interface INotificationTypeRepository : IRepository<NotificationType>
{
    public Task<NotificationType?> GetByIdDetailAsync(Guid id);
    // Lấy nhiều NotificationType theo danh sách các ID
    public Task<List<NotificationType>> GetByIdsAsync(List<Guid> ids);
}



