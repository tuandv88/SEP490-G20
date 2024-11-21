using Community.Application.Extensions;
using Community.Application.Models.NotificationHistories.Dtos;

namespace Community.Application.Models.NotificationHistories.Queries.GetNotificationHistories
{
    public class GetNotificationHistoriesHandler : IQueryHandler<GetNotificationHistoriesQuery, GetNotificationHistoriesResult>
    {
        private readonly INotificationHistoryRepository _repository;

        public GetNotificationHistoriesHandler(INotificationHistoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<GetNotificationHistoriesResult> Handle(GetNotificationHistoriesQuery query, CancellationToken cancellationToken)
        {
            var allData = await _repository.GetAllAsync();

            // Lấy thông tin phân trang
            var pageIndex = query.PaginationRequest.PageIndex;
            var pageSize = query.PaginationRequest.PageSize;

            var totalCount = allData.Count();

            var notificationHistories = allData.OrderByDescending(n => n.DateSent)
                                                .Skip(pageSize * (pageIndex - 1))
                                                .Take(pageSize)
                                                .ToList();

            var notificationHistoryDtos = notificationHistories
                                          .Select(n => n.ToNotificationHistoryDto())
                                          .ToList();

            var paginatedData = new PaginatedResult<NotificationHistoryDto>(pageIndex, pageSize, totalCount, notificationHistoryDtos);

            return new GetNotificationHistoriesResult(paginatedData);
        }
    }
}
