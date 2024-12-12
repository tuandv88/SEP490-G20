using Community.Application.Interfaces;
using Community.Application.Models.NotificationHistories.Dtos;
using Community.Domain.ValueObjects;

namespace Community.Application.Models.NotificationHistories.Commands.CreateNotificationHistory
{
    public class CreateNotificationHistoryHandler : ICommandHandler<CreateNotificationHistoryCommand, CreateNotificationHistoryResult>
    {
        private readonly INotificationHistoryRepository _notificationHistoryRepository;
        private readonly INotificationTypeRepository _notificationTypeRepository;

        public CreateNotificationHistoryHandler(INotificationHistoryRepository notificationHistoryRepository, INotificationTypeRepository notificationTypeRepository)
        {
            _notificationHistoryRepository = notificationHistoryRepository;
            _notificationTypeRepository = notificationTypeRepository;
        }

        public async Task<CreateNotificationHistoryResult> Handle(CreateNotificationHistoryCommand request, CancellationToken cancellationToken)
        {
            var notificationType = await _notificationTypeRepository.GetByIdAsync(request.CreateNotificationHistoryDto.NotificationTypeId);

            if (notificationType == null)
            {
                throw new NotFoundException("NotificationType not found.", request.CreateNotificationHistoryDto.NotificationTypeId);
            }

            // Validate SentVia and Status Enum values
            if (!Enum.TryParse(request.CreateNotificationHistoryDto.SentVia, out SentVia sentVia))
            {
                throw new ConflictException("Invalid SentVia value.");
            }

            if (!Enum.TryParse(request.CreateNotificationHistoryDto.Status, out Status status))
            {
                throw new ConflictException("Invalid Status value.");
            }

            var notificationHistory = await CreateNewNotificationHistory(request.CreateNotificationHistoryDto, sentVia, status);

            await _notificationHistoryRepository.AddAsync(notificationHistory);
            await _notificationHistoryRepository.SaveChangesAsync(cancellationToken);

            return new CreateNotificationHistoryResult(notificationHistory.Id.Value, true);
        }

        private async Task<NotificationHistory> CreateNewNotificationHistory(CreateNotificationHistoryDto createNotificationHistoryDto, SentVia sentVia, Status status)
        {
            var notificationTypeId = NotificationTypeId.Of(createNotificationHistoryDto.NotificationTypeId);
            var userNotificationId = UserNotificationSettingId.Of(createNotificationHistoryDto.UserNotificationSettingId);

            // Tạo NotificationHistory mới
            var notificationHistory = NotificationHistory.Create(
                notificationHistoryId: NotificationHistoryId.Of(Guid.NewGuid()),
                userId: UserId.Of(createNotificationHistoryDto.UserIdReceive),
                notificationTypeId: notificationTypeId,
                userNotificationSettingId: userNotificationId,
                createNotificationHistoryDto.Message,
                sentVia,
                status,
                senderId: createNotificationHistoryDto.UserIdSend
            );

            // Cập nhật các trường bổ sung
            notificationHistory.DateCreated = DateTime.UtcNow; // Thời gian tạo thông báo
            notificationHistory.Subject = createNotificationHistoryDto.Subject; // Nếu có Subject

            return notificationHistory;
        }

    }
}
