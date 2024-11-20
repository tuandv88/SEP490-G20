using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using User.Application.Data.Repositories;
using User.Application.Models.PointHistories.Dtos;
using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions;
using User.Application.Models.PointHistories.Queries.GetPointHistories;

namespace User.Application.Models.PointHistories.Queries.GetPointHistories
{
    public class GetPointHistoryByUserIdHandler : IQueryHandler<GetPointHistoryByUserIdQuery, GetPointHistoryByUserIdResult>
    {
        private readonly IPointHistoryRepository _pointHistoryRepository;

        public GetPointHistoryByUserIdHandler(IPointHistoryRepository pointHistoryRepository)
        {
            _pointHistoryRepository = pointHistoryRepository;
        }

        public async Task<GetPointHistoryByUserIdResult> Handle(GetPointHistoryByUserIdQuery request, CancellationToken cancellationToken)
        {
            // Lấy danh sách PointHistory từ repository bằng UserId
            var pointHistories = await _pointHistoryRepository.GetPointHistoryByUserIdAsync(request.UserId);

            // Chuyển dữ liệu thành DTO (PointHistoryDto)
            var pointHistoryDtos = pointHistories.Select(ph => new PointHistoryDto(
                ph.Id.Value,
                ph.UserId.Value,
                ph.Point,
                ph.ChangeType.ToString(),
                ph.Source,
                ph.DateReceived,
                ph.LastUpdated
            )).ToList();

            // Trả về kết quả dưới dạng GetPointHistoryByUserIdResult
            return new GetPointHistoryByUserIdResult(pointHistoryDtos);
        }
    }
}
