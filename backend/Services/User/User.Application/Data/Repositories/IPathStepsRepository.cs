

namespace User.Application.Data.Repositories
{
    public  interface IPathStepsRepository : IRepository<PathStep>
    {
        Task<List<PathStep>> GetByLearningPathIDAsync(Guid LearningPathId);

        Task<PathStep> GetByPathStepIdAsync(Guid pathStepId);
        Task<int?> GetMaxStepOrderByLearningPathIdAsync(Guid learningPathId);
        Task<PathStep> GetByLearningPathAndCourseIdAsync(Guid learningPathId, Guid courseId);

    }
}
