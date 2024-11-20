using System;
using System.Threading.Tasks;
using User.Domain.Models;

namespace User.Infrastructure.Data.Repositories.LearningPaths
{
    internal class LearningPathRepository : Repository<LearningPath>, ILearningPathRepository
    {
        private readonly IApplicationDbContext _dbContext;

        public LearningPathRepository(IApplicationDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public override async Task<LearningPath> GetByIdAsync(Guid id)
        {
            // Triển khai logic để lấy LearningPath theo Id từ database
            var learningPath = await _dbContext.LearningPaths.FindAsync(id);
            if (learningPath == null)
            {
                throw new KeyNotFoundException($"LearningPath với id '{id}' không được tìm thấy.");
            }
            return learningPath;
        }

        public override async Task DeleteByIdAsync(Guid id)
        {
            var learningPath = await GetByIdAsync(id); // Sử dụng phương thức GetByIdAsync
            if (learningPath == null)
            {
                throw new KeyNotFoundException($"LearningPath với id '{id}' không được tìm thấy.");
            }

            _dbContext.LearningPaths.Remove(learningPath);
        }

        public async Task<List<LearningPath>> GetByUserIdAsync(Guid userId)
        {
            var userIdObject = new UserId(userId);

            // Truy vấn để lấy danh sách LearningPaths có UserId khớp với UserId và bao gồm cả các PathSteps
            var learningPaths = await _dbContext.LearningPaths
                .Where(lp => lp.UserId.Equals(userIdObject))
                .Include(lp => lp.PathSteps) // Eager Load các PathSteps cho mỗi LearningPath
                .ToListAsync();

            return learningPaths;
        }

        public async Task<LearningPath> GetByLearningPathIdAsync(Guid learningPathId)
        {
            // Chuyển đổi Guid thành LearningPathId trước khi thực hiện truy vấn
            var learningPathIdObject = LearningPathId.Of(learningPathId);

            var learningPath = await _dbContext.LearningPaths
                .FirstOrDefaultAsync(lp => lp.Id == learningPathIdObject); // So sánh với LearningPathId dưới dạng ValueObject

            return learningPath;
        }

    }
}
