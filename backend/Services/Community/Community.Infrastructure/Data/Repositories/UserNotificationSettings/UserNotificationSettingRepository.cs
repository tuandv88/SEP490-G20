namespace Community.Infrastructure.Data.Repositories.UserNotificationSettings;

public class UserNotificationSettingRepository : Repository<UserNotificationSetting>, IUserNotificationSettingRepository
{
    private readonly IApplicationDbContext _dbContext;
    public UserNotificationSettingRepository(IApplicationDbContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException();
    }

    public override async Task DeleteByIdAsync(Guid id)
    {
        var userNotificationSetting = await GetByIdAsync(id);
        if (userNotificationSetting != null)
        {
            _dbContext.UserNotificationSettings.Remove(userNotificationSetting);
        }
    }

    public override async Task<UserNotificationSetting?> GetByIdAsync(Guid id)
    {
        var userNotificationSetting = _dbContext.UserNotificationSettings
                        .AsEnumerable()
                        .FirstOrDefault(c => c.Id.Value == id);
        return userNotificationSetting;
    }

    public async Task<UserNotificationSetting?> GetByIdDetailAsync(Guid id)
    {
        return null;
    }
}

