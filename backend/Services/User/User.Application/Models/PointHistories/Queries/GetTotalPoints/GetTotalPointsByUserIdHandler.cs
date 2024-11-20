using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using User.Application.Data.Repositories;
using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions;
using User.Application.Models.PointHistories.Queries.GetTotalPoints;

namespace User.Application.Models.PointHistories.Queries.GetTotalPoints
{
    public class GetTotalPointsByUserIdHandler : IQueryHandler<GetTotalPointsByUserIdQuery, long>
    {
        private readonly IPointHistoryRepository _pointHistoryRepository;

        public GetTotalPointsByUserIdHandler(IPointHistoryRepository pointHistoryRepository)
        {
            _pointHistoryRepository = pointHistoryRepository;
        }

        public async Task<long> Handle(GetTotalPointsByUserIdQuery request, CancellationToken cancellationToken)
        {
            // Lấy danh sách PointHistory của người dùng từ repository
            var pointHistories = await _pointHistoryRepository.GetPointHistoryByUserIdAsync(request.UserId);

            if (pointHistories == null || !pointHistories.Any())
            {
                throw new NotFoundException($"Không tìm thấy lịch sử điểm cho người dùng có UserId '{request.UserId}'.");
            }

            // Tính tổng số điểm còn lại (cộng dồn các điểm từ lịch sử)
            long totalPoints = pointHistories.Sum(ph => ph.Point);

            // Trả về tổng số điểm
            return totalPoints;
        }
    }
}
