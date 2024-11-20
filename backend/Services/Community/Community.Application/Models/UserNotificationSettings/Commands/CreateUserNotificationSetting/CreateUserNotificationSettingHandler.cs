using Community.Application.Data.Repositories;
using Community.Application.Interfaces;
using Community.Domain.ValueObjects;
using Community.Domain.Enums;
using Community.Application.Models.UserNotificationSettings.Dtos;

namespace Community.Application.Models.UserNotificationSettings.Commands.CreateUserNotificationSetting
{
    public class CreateUserNotificationSettingHandler : ICommandHandler<CreateUserNotificationSettingCommand, CreateUserNotificationSettingResult>
    {
        private readonly IUserNotificationSettingRepository _userNotificationSettingRepository;
        private readonly INotificationTypeRepository _notificationTypeRepository;
        private readonly IUserContextService _userContextService;

        public CreateUserNotificationSettingHandler(
            IUserNotificationSettingRepository userNotificationSettingRepository,
            INotificationTypeRepository notificationTypeRepository,
            IUserContextService userContextService)
        {
            _userNotificationSettingRepository = userNotificationSettingRepository;
            _notificationTypeRepository = notificationTypeRepository;
            _userContextService = userContextService;
        }

        public async Task<CreateUserNotificationSettingResult> Handle(CreateUserNotificationSettingCommand request, CancellationToken cancellationToken)
        {
            // Lấy NotificationType từ repository
            var notificationType = await _notificationTypeRepository.GetByIdAsync(request.CreateUserNotificationSettingDto.NotificationTypeId);

            if (notificationType == null)
            {
                throw new NotFoundException("NotificationType not found.", request.CreateUserNotificationSettingDto.NotificationTypeId);
            }

            // Kiểm tra giá trị NotificationFrequency và parse Enum nếu cần
            if (!Enum.TryParse<NotificationFrequency>(request.CreateUserNotificationSettingDto.NotificationFrequency, true, out var frequency) || !Enum.IsDefined(typeof(NotificationFrequency), frequency))
            {
                throw new ArgumentException($"Invalid NotificationFrequency value: {request.CreateUserNotificationSettingDto.NotificationFrequency}. Valid values are: Immediate, Daily, Weekly.");
            }

            // Tạo mới UserNotificationSetting
            var userNotificationSetting = await CreateNewUserNotificationSetting(request.CreateUserNotificationSettingDto, frequency);

            // Lưu cài đặt thông báo vào repository
            await _userNotificationSettingRepository.AddAsync(userNotificationSetting);
            await _userNotificationSettingRepository.SaveChangesAsync(cancellationToken);

            return new CreateUserNotificationSettingResult(userNotificationSetting.Id.Value, true);
        }

        private async Task<UserNotificationSetting> CreateNewUserNotificationSetting(CreateUserNotificationSettingDto createUserNotificationSettingDto, NotificationFrequency notificationFrequency)
        {
            // Dữ liệu test UserId
            var userContextTest = "c3d4e5f6-a7b8-9012-3456-789abcdef010";

            if (!Guid.TryParse(userContextTest, out var currentUserIdTest))
            {
                throw new UnauthorizedAccessException("Invalid user ID.");
            }

            var userId = UserId.Of(currentUserIdTest);

            // Lấy UserId từ UserContextService nếu cần
            //var currentUserId = _userContextService.User.Id;
            //if (currentUserId == null)
            //{
            //    throw new UnauthorizedAccessException("User is not authenticated.");
            //}
            //var userId = UserId.Of(currentUserId.Value);

            return UserNotificationSetting.Create(
                userNotificationSettingId: UserNotificationSettingId.Of(Guid.NewGuid()),
                userId: userId,
                notificationTypeId: NotificationTypeId.Of(createUserNotificationSettingDto.NotificationTypeId),
                isNotificationEnabled: createUserNotificationSettingDto.IsNotificationEnabled,
                isEmailEnabled: createUserNotificationSettingDto.IsEmailEnabled,
                isWebsiteEnabled: createUserNotificationSettingDto.IsWebsiteEnabled,
                notificationFrequency: notificationFrequency  
            );
        }
    }
}
