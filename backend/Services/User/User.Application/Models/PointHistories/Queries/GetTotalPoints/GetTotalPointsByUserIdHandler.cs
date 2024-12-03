using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using User.Application.Data.Repositories;
using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions;
using User.Application.Models.PointHistories.Queries.GetTotalPoints;
using User.Application.Interfaces;

namespace User.Application.Models.PointHistories.Queries.GetTotalPoints
{
    public class GetTotalPointsByUserIdHandler : IQueryHandler<GetTotalPointsByUserIdQuery, long>
    {
        private readonly IPointHistoryRepository _pointHistoryRepository;
        private readonly IUserContextService _userContext;
        public GetTotalPointsByUserIdHandler(IPointHistoryRepository pointHistoryRepository, IUserContextService userContext)
        {
            _pointHistoryRepository = pointHistoryRepository;
            _userContext = userContext;
        }

        public async Task<long> Handle(GetTotalPointsByUserIdQuery request, CancellationToken cancellationToken)
        {
            // Lấy danh sách PointHistory của người dùng từ repository
            var pointHistories = await _pointHistoryRepository.GetTotalRemainingPointsByUserIdAsync(_userContext.User.Id);
            // Trả về tổng số điểm
            return pointHistories;
        }
    }
}
