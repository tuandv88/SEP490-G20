namespace Community.Application.Data.Repositories;

public interface IUserNotificationSettingRepository : IRepository<UserNotificationSetting>
{
    public Task<UserNotificationSetting?> GetByIdDetailAsync(Guid id);
}
