
using User.Domain.Enums;

namespace User.Infrastructure.Data.Repositories.PointHistories
{
    public class PointHistoryRepository : Repository<PointHistory>, IPointHistoryRepository
    {

        private readonly IApplicationDbContext _dbContext;
        public PointHistoryRepository(IApplicationDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException();
        }

        public override async Task<PointHistory> GetByIdAsync(Guid id)
        {
            // Triển khai logic để lấy PointHistory theo Id từ database
            return await _dbContext.PointHistories.FindAsync(id);
        }
        public override async Task DeleteByIdAsync(Guid id)
        {
            var pointHistory = await _dbContext.PointHistories.FindAsync(id);
            if (pointHistory == null)
            {
                throw new KeyNotFoundException($"PointHistory với id '{id}' không được tìm thấy.");
            }

            _dbContext.PointHistories.Remove(pointHistory);
        }
        public async Task<List<PointHistory>> GetPointHistoryByUserIdAsync(Guid userId)
        {
            // Chuyển đổi Guid thành UserId ValueObject
            var userIdObject = new UserId(userId);

            // Truy vấn để lấy danh sách PointHistory theo UserId
            var pointHistories = await _dbContext.PointHistories
                .Where(ph => ph.UserId.Equals(userIdObject)) // So sánh trực tiếp với Guid của UserId
                .OrderByDescending(ph => ph.DateReceived) // Sắp xếp theo ngày nhận điểm, mới nhất trước
                .ToListAsync();

            return pointHistories;
        }
        public async Task<long> GetTotalRemainingPointsByUserIdAsync(Guid userId)
        {
            var userIdObject = new UserId(userId);

            // Tính tổng điểm còn lại theo ChangeType
            var remainingPoints = await _dbContext.PointHistories
                .Where(ph => ph.UserId.Equals(userIdObject)) // Lọc theo UserId
                .SumAsync(ph => ph.ChangeType == ChangeType.Earned ? ph.Point :
                                ph.ChangeType == ChangeType.Deducted ? -ph.Point : 0); // Tính tổng điểm cộng và trừ

            return remainingPoints;
        }

    }
}
