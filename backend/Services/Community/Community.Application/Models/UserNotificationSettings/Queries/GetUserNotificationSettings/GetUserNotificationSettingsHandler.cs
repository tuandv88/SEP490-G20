using Community.Application.Extensions;
using Community.Application.Models.NotificationTypes.Dtos;
using Community.Application.Models.NotificationTypes.Queries.GetNotificationTypesPaging;
using Community.Application.Models.UserNotificationSettings.Dtos;

namespace Community.Application.Models.UserNotificationSettings.Queries.GetUserNotificationSettings;

public class GetUserNotificationSettingsHandler : IQueryHandler<GetUserNotificationSettingsQuery, GetUserNotificationSettingsPagingResult>
{
    private readonly IUserNotificationSettingRepository _repository;

    public GetUserNotificationSettingsHandler(IUserNotificationSettingRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetUserNotificationSettingsPagingResult> Handle(GetUserNotificationSettingsQuery query, CancellationToken cancellationToken)
    {
        var allData = await _repository.GetAllAsync();

        // Lấy thông tin phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        var totalCount = allData.Count();

        var userNotificationSettings = allData.Skip(pageSize * (pageIndex - 1))
                                        .Take(pageSize)
                                        .ToList();

        // Chuyển đổi sang DTO
        var userNotificationSettingDtos = userNotificationSettings.Select(n => n.ToUserNotificationSettingDto()).ToList();

        var notificationTypesPaginateData = new PaginatedResult<UserNotificationSettingDto>(pageIndex, pageSize, totalCount, userNotificationSettingDtos);

        return new GetUserNotificationSettingsPagingResult(notificationTypesPaginateData);
    }
}