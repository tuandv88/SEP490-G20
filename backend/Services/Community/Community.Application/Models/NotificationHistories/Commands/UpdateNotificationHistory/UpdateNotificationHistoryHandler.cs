using Community.Application.Models.Notifications.Commands.UpdateNotificationHistory;
using Community.Domain.ValueObjects;

public class UpdateNotificationHistoryHandler : ICommandHandler<UpdateNotificationHistoryCommand, UpdateNotificationHistoryResult>
{
    private readonly INotificationHistoryRepository _notificationHistoryRepository;
    private readonly INotificationTypeRepository _notificationTypeRepository;

    public UpdateNotificationHistoryHandler(INotificationHistoryRepository notificationHistoryRepository, INotificationTypeRepository notificationTypeRepository)
    {
        _notificationHistoryRepository = notificationHistoryRepository;
        _notificationTypeRepository = notificationTypeRepository;
    }

    public async Task<UpdateNotificationHistoryResult> Handle(UpdateNotificationHistoryCommand request, CancellationToken cancellationToken)
    {
        var notificationType = await _notificationTypeRepository.GetByIdAsync(request.UpdateNotificationHistoryDto.NotificationTypeId);

        if (notificationType == null)
        {
            throw new NotFoundException("NotificationType not found.", request.UpdateNotificationHistoryDto.NotificationTypeId);
        }

        // Lấy NotificationHistory từ cơ sở dữ liệu
        var notificationHistory = await _notificationHistoryRepository.GetByIdAsync(request.UpdateNotificationHistoryDto.Id);

        if (notificationHistory == null)
        {
            throw new NotFoundException("NotificationHistory not found.", request.UpdateNotificationHistoryDto.Id);
        }

        // Chuyển đổi SentVia và Status
        if (!Enum.TryParse<SentVia>(request.UpdateNotificationHistoryDto.SentVia, true, out var sentVia) ||
            !Enum.IsDefined(typeof(SentVia), sentVia))
        {
            throw new ArgumentException($"Invalid SentVia value: {request.UpdateNotificationHistoryDto.SentVia}.");
        }

        if (!Enum.TryParse<Status>(request.UpdateNotificationHistoryDto.Status, true, out var status) ||
            !Enum.IsDefined(typeof(Status), status))
        {
            throw new ArgumentException($"Invalid Status value: {request.UpdateNotificationHistoryDto.Status}.");
        }

        // Cập nhật NotificationHistory
        notificationHistory.Update(
            NotificationTypeId.Of(request.UpdateNotificationHistoryDto.NotificationTypeId),
            request.UpdateNotificationHistoryDto.Message,
            request.UpdateNotificationHistoryDto.DateRead,
            request.UpdateNotificationHistoryDto.IsRead,
            sentVia,
            status
        );

        // Cập nhật các trường mới nếu có
        if (!string.IsNullOrEmpty(request.UpdateNotificationHistoryDto.Subject))
        {
            notificationHistory.Subject = request.UpdateNotificationHistoryDto.Subject;
        }

        // Lưu thay đổi
        await _notificationHistoryRepository.UpdateAsync(notificationHistory);
        await _notificationHistoryRepository.SaveChangesAsync(cancellationToken);

        return new UpdateNotificationHistoryResult(true);
    }
}
