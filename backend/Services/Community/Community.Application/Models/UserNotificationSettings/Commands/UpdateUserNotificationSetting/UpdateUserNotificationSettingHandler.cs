using Community.Application.Models.UserNotificationSettings.Commands.UpdateUserNotificationSetting;
using Community.Domain.ValueObjects;

public class UpdateUserNotificationSettingHandler : ICommandHandler<UpdateUserNotificationSettingCommand, UpdateUserNotificationSettingResult>
{
    private readonly IUserNotificationSettingRepository _userNotificationSettingRepository;

    public UpdateUserNotificationSettingHandler(IUserNotificationSettingRepository userNotificationSettingRepository)
    {
        _userNotificationSettingRepository = userNotificationSettingRepository;
    }

    public async Task<UpdateUserNotificationSettingResult> Handle(UpdateUserNotificationSettingCommand request, CancellationToken cancellationToken)
    {
        var dto = request.UpdateUserNotificationSettingDto;

        // Lấy UserNotificationSetting từ cơ sở dữ liệu
        var userNotificationSetting = await _userNotificationSettingRepository.GetByIdAsync(dto.Id);
        if (userNotificationSetting == null)
        {
            throw new NotFoundException("UserNotificationSetting not found.", dto.Id);
        }

        // Chuyển đổi NotificationFrequency
        if (!Enum.TryParse<NotificationFrequency>(dto.NotificationFrequency, true, out var notificationFrequency) ||
            !Enum.IsDefined(typeof(NotificationFrequency), notificationFrequency))
        {
            throw new ArgumentException($"Invalid NotificationFrequency value: {dto.NotificationFrequency}.");
        }

        // Cập nhật cài đặt
        userNotificationSetting.UpdateSettings(
            dto.IsNotificationEnabled,
            dto.IsEmailEnabled,
            dto.IsWebsiteEnabled,
            notificationFrequency
        );

        // Lưu thay đổi
        await _userNotificationSettingRepository.UpdateAsync(userNotificationSetting);
        await _userNotificationSettingRepository.SaveChangesAsync(cancellationToken);

        return new UpdateUserNotificationSettingResult(true);
    }
}
