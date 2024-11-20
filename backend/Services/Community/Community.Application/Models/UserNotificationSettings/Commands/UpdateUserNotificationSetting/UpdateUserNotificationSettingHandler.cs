using Community.Application.Models.UserNotificationSettings.Commands.UpdateUserNotificationSetting;
using Community.Domain.Models;
using Community.Domain.ValueObjects;

public class UpdateUserNotificationSettingHandler : ICommandHandler<UpdateUserNotificationSettingCommand, UpdateUserNotificationSettingResult>
{
    private readonly IUserNotificationSettingRepository _userNotificationSettingRepository;
    private readonly INotificationTypeRepository _notificationTypeRepository;

    public UpdateUserNotificationSettingHandler(IUserNotificationSettingRepository userNotificationSettingRepository, INotificationTypeRepository notificationTypeRepository)
    {
        _userNotificationSettingRepository = userNotificationSettingRepository;
        _notificationTypeRepository = notificationTypeRepository;
    }

    public async Task<UpdateUserNotificationSettingResult> Handle(UpdateUserNotificationSettingCommand request, CancellationToken cancellationToken)
    {
        var dto = request.UpdateUserNotificationSettingDto;

        // Kiểm tra NotificationTypeId có tồn tại
        var notificationType = await _notificationTypeRepository.GetByIdAsync(dto.NotificationTypeId);
        if (notificationType == null)
        {
            throw new NotFoundException("NotificationType not found.", dto.NotificationTypeId);
        }

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
            NotificationTypeId.Of(dto.NotificationTypeId),
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
