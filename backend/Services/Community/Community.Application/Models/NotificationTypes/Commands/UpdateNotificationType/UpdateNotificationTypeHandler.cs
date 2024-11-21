using Community.Application.Models.NotificationTypes.Commands.UpdateNotificationType;
using Community.Domain.Models;

public class UpdateNotificationTypeHandler : ICommandHandler<UpdateNotificationTypeCommand, UpdateNotificationTypeResult>
{
    private readonly INotificationTypeRepository _notificationTypeRepository;

    public UpdateNotificationTypeHandler(INotificationTypeRepository notificationTypeRepository)
    {
        _notificationTypeRepository = notificationTypeRepository;
    }

    public async Task<UpdateNotificationTypeResult> Handle(UpdateNotificationTypeCommand request, CancellationToken cancellationToken)
    {
        var dto = request.UpdateNotificationTypeDto;

        // Lấy NotificationType từ cơ sở dữ liệu
        var notificationType = await _notificationTypeRepository.GetByIdAsync(dto.Id);
        if (notificationType == null)
        {
            throw new NotFoundException("NotificationType not found.", dto.Id);
        }

        // Sử dụng phương thức Update để cập nhật
        notificationType.Update(
            dto.Name,
            dto.Description,
            dto.CanSendEmail,
            dto.CanSendWebsite,
            dto.Priority
        );

        // Lưu thay đổi
        await _notificationTypeRepository.UpdateAsync(notificationType);
        await _notificationTypeRepository.SaveChangesAsync(cancellationToken);

        return new UpdateNotificationTypeResult(true);
    }
}
