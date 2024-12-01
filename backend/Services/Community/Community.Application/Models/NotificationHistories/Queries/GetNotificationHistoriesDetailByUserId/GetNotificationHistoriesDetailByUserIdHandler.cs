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

//public class GetNotificationHistoriesDetailByUserIdHandler : IQueryHandler<GetNotificationHistoriesDetailByUserIdQuery, GetNotificationHistoriesDetailByUserIdResult>
//{
//    private readonly INotificationHistoryRepository _repository;
//    private readonly INotificationTypeRepository _notificationTypeRepository;
//    private readonly IUserContextService _userContextService;

//    public GetNotificationHistoriesDetailByUserIdHandler(INotificationHistoryRepository repository, INotificationTypeRepository notificationTypeRepository, IUserContextService userContextService)
//    {
//        _repository = repository;
//        _notificationTypeRepository = notificationTypeRepository;
//        _userContextService = userContextService;
//    }

//    public async Task<GetNotificationHistoriesDetailByUserIdResult> Handle(GetNotificationHistoriesDetailByUserIdQuery query, CancellationToken cancellationToken)
//    {

//        //Lấy UserId từ UserContextService
//        var currentUserId = _userContextService.User.Id;

//        if (currentUserId == null)
//        {
//            throw new UnauthorizedAccessException("User is Not authenticated.");
//        }

//        var userId = UserId.Of(currentUserId);

//        var allData = await _repository.GetAllNotificationDetailByUserId(userId.Value);

//        if(allData == null)
//        {
//            throw new NotFoundException("Not Found NotifiactionHistories.");
//        }

//        var notificationType = _notificationTypeRepository.GetByIdAsync(userId.Value);

//        // Lấy thông tin phân trang
//        var pageIndex = query.PaginationRequest.PageIndex;
//        var pageSize = query.PaginationRequest.PageSize;

//        var totalCount = allData.Count();

//        var notificationHistories = allData.OrderByDescending(n => n.DateSent)
//                                            .Skip(pageSize * (pageIndex - 1))
//                                            .Take(pageSize)
//                                            .ToList();

//        var notificationHistoryDtos = notificationHistories
//                                      .Select(n => n.ToNotificationHistoryDto())
//                                      .ToList();

//        var paginatedData = new PaginatedResult<NotificationHistoryDto>(pageIndex, pageSize, totalCount, notificationHistoryDtos);

//        return new GetNotificationHistoriesResult(paginatedData);
//    }
//}
