using Community.Application.Extensions;
using Community.Application.Models.NotificationTypes.Dtos;
using Community.Application.Models.NotificationTypes.Queries.GetNotificationTypesPaging;

namespace Community.Application.Models.NotificationTypes.Queries.GetNotificationTypesPaging;

public class GetNotificationTypesPagingHandler : IQueryHandler<GetNotificationTypesPagingQuery, GetNotificationTypesPagingResult>
{
    private readonly INotificationTypeRepository _repository;

    public GetNotificationTypesPagingHandler(INotificationTypeRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetNotificationTypesPagingResult> Handle(GetNotificationTypesPagingQuery query, CancellationToken cancellationToken)
    {
        var allData = await _repository.GetAllAsync();

        // Lấy thông tin phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        var totalCount = allData.Count();

        var notificationTypes = allData.OrderBy(n => n.Priority)
                                        .Skip(pageSize * (pageIndex - 1))
                                        .Take(pageSize)
                                        .ToList();

        // Chuyển đổi sang DTO
        var notificationTypeDtos = notificationTypes.Select(n => n.ToNotificationTypeDto()).ToList();

        var notificationTypesPaginateData = new PaginatedResult<NotificationTypeDto>(pageIndex, pageSize, totalCount, notificationTypeDtos);

        return new GetNotificationTypesPagingResult(notificationTypesPaginateData);
    }
}
