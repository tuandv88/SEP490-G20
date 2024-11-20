using User.Domain.ValueObjects;

namespace User.Application.Data.Repositories
{
    public interface ILearningPathRepository : IRepository<LearningPath>
    {
        Task<List<LearningPath>> GetByUserIdAsync(Guid userId);

        Task<LearningPath> GetByLearningPathIdAsync(Guid learningPathId);
    }
}
