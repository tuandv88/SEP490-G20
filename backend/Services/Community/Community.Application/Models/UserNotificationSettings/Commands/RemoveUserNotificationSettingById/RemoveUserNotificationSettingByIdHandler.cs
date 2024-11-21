namespace Community.Application.Models.UserNotificationSettings.Commands.RemoveUserNotificationSettingById;

public class RemoveUserNotificationSettingByIdHandler : ICommandHandler<RemoveUserNotificationSettingByIdCommand, RemoveUserNotificationSettingByIdResult>
{
    private readonly IUserNotificationSettingRepository _userNotificationSettingRepository;

    public RemoveUserNotificationSettingByIdHandler(IUserNotificationSettingRepository userNotificationSettingRepository)
    {
        _userNotificationSettingRepository = userNotificationSettingRepository;
    }

    public async Task<RemoveUserNotificationSettingByIdResult> Handle(RemoveUserNotificationSettingByIdCommand request, CancellationToken cancellationToken)
    {
        var userNotificationSetting = await _userNotificationSettingRepository.GetByIdAsync(request.Id);

        if (userNotificationSetting == null)
        {
            throw new NotFoundException("User Notification Setting not found.", request.Id);
        }

        await _userNotificationSettingRepository.DeleteByIdAsync(request.Id);
        await _userNotificationSettingRepository.SaveChangesAsync(cancellationToken);

        return new RemoveUserNotificationSettingByIdResult(true);
    }
}
