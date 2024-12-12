using Community.Application.Models.NotificationHistories.Dtos;
using Community.Domain.ValueObjects;

namespace Community.Application.Models.NotificationHistories.Commands.CreatesNotificationHistory;

public class CreatesNotificationHistoryHandler : ICommandHandler<CreatesNotificationHistoryCommand, CreatesNotificationHistoryResult>
{
    private readonly INotificationHistoryRepository _notificationHistoryRepository;
    private readonly INotificationTypeRepository _notificationTypeRepository;

    public CreatesNotificationHistoryHandler(INotificationHistoryRepository notificationHistoryRepository, INotificationTypeRepository notificationTypeRepository)
    {
        _notificationHistoryRepository = notificationHistoryRepository;
        _notificationTypeRepository = notificationTypeRepository;
    }

    public async Task<CreatesNotificationHistoryResult> Handle(CreatesNotificationHistoryCommand request, CancellationToken cancellationToken)
    {
        var notificationType = await _notificationTypeRepository.GetByIdAsync(request.CreatesNotificationHistoryDto.NotificationTypeId);

        if (notificationType == null)
        {
            throw new NotFoundException("NotificationType not found.", request.CreatesNotificationHistoryDto.NotificationTypeId);
        }

        // Validate SentVia and Status Enum values
        if (!Enum.TryParse(request.CreatesNotificationHistoryDto.SentVia, out SentVia sentVia))
        {
            throw new ConflictException("Invalid SentVia value.");
        }

        if (!Enum.TryParse(request.CreatesNotificationHistoryDto.Status, out Status status))
        {
            throw new ConflictException("Invalid Status value.");
        }

        foreach (var userId in request.CreatesNotificationHistoryDto.UserIdsReceive)
        {
            var notificationHistory = await CreatesNewNotificationHistory(userId, request.CreatesNotificationHistoryDto, sentVia, status);
            await _notificationHistoryRepository.AddAsync(notificationHistory); // Lưu từng đối tượng
        }

        await _notificationHistoryRepository.SaveChangesAsync(cancellationToken);


        return new CreatesNotificationHistoryResult(true);
    }

    private async Task<NotificationHistory> CreatesNewNotificationHistory(Guid userIdReceive, CreatesNotificationHistoryDto createsNotificationHistoryDto, SentVia sentVia, Status status)
    {
        var notificationTypeId = NotificationTypeId.Of(createsNotificationHistoryDto.NotificationTypeId);
        var userNotificationId = UserNotificationSettingId.Of(createsNotificationHistoryDto.UserNotificationSettingId);

        var notificationHistory = NotificationHistory.Create(
            notificationHistoryId: NotificationHistoryId.Of(Guid.NewGuid()),
            userId: UserId.Of(userIdReceive),
            notificationTypeId: notificationTypeId,
            userNotificationSettingId: userNotificationId,
            createsNotificationHistoryDto.Message,
            sentVia,
            status,
            senderId: createsNotificationHistoryDto.UserIdSend
        );

        notificationHistory.DateCreated = DateTime.UtcNow;
        notificationHistory.Subject = createsNotificationHistoryDto.Subject;

        return notificationHistory;
    }
}
