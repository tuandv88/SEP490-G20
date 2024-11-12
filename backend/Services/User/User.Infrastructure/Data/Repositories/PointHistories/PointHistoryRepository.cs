
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
    }
}
