using Community.Application.Extensions;
using Community.Application.Interfaces;
using Community.Application.Models.NotificationHistories.Dtos;
using Community.Application.Models.NotificationHistories.Queries.GetNotificationHistories;
using Community.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.NotificationHistories.Queries.GetNotificationHistoriesDetail;

public class GetNotificationHistoriesDetailByUserIdHandler : IQueryHandler<GetNotificationHistoriesDetailByUserIdQuery, GetNotificationHistoriesDetailByUserIdResult>
{
    private readonly INotificationHistoryRepository _repository;
    private readonly INotificationTypeRepository _notificationTypeRepository;
    private readonly IUserContextService _userContextService;

    public GetNotificationHistoriesDetailByUserIdHandler(INotificationHistoryRepository repository, INotificationTypeRepository notificationTypeRepository, IUserContextService userContextService)
    {
        _repository = repository;
        _notificationTypeRepository = notificationTypeRepository;
        _userContextService = userContextService;
    }

    public async Task<GetNotificationHistoriesDetailByUserIdResult> Handle(GetNotificationHistoriesDetailByUserIdQuery query, CancellationToken cancellationToken)
    {

        //Lấy UserId từ UserContextService
        var currentUserId = _userContextService.User.Id;

        if (currentUserId == null)
        {
            throw new UnauthorizedAccessException("User is Not authenticated.");
        }

        var userId = UserId.Of(currentUserId);

        var allData = await _repository.GetAllNotificationDetailByUserId(userId.Value);

        if (allData == null)
        {
            throw new NotFoundException("Not Found NotifiactionHistories.");
        }


        Console.WriteLine("----------1 1 1--------");

        // Lấy thông tin NotificationType cho tất cả các NotificationHistory (tạo dictionary để tối ưu)
        var notificationTypeIds = allData.Select(n => n.NotificationTypeId.Value);

        Console.WriteLine(notificationTypeIds);
        foreach (var notificationTypeId in notificationTypeIds)
        {
            Console.WriteLine(notificationTypeId);
            Console.WriteLine("---------------------");
        }
        var notificationTypes = await _notificationTypeRepository.GetByIdsAsync(notificationTypeIds.ToList());

        if (notificationTypes == null || !notificationTypes.Any())
        {
            throw new NotFoundException("Notification Types not found.");
        }


        // Lấy thông tin phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        var totalCount = allData.Count();

        // Lấy các bản ghi theo phân trang
        var notificationHistories = allData.OrderByDescending(n => n.DateSent)
                                            .Skip(pageSize * (pageIndex - 1))
                                            .Take(pageSize)
                                            .ToList();

        // Chuyển đổi các bản ghi NotificationHistoryDetail thành NotificationHistoryDetailDto
        var notificationHistoryDtos = notificationHistories
                                 .Select(n =>
                                 {
                                     var notificationType = notificationTypes.FirstOrDefault(nt => nt.Id == n.NotificationTypeId);
                                     return notificationType != null
                                         ? n.ToNotificationHistoryDetailDto(notificationType)
                                         : null;
                                 })
                                 .Where(dto => dto != null)
                                 .ToList();

        // Tạo kết quả phân trang
        var paginatedData = new PaginatedResult<NotificationHistoryDetailDto>(pageIndex, pageSize, totalCount, notificationHistoryDtos);

        return new GetNotificationHistoriesDetailByUserIdResult(paginatedData);
    }
}
