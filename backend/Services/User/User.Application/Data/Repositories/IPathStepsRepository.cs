

namespace User.Application.Data.Repositories
{
    public  interface IPathStepsRepository : IRepository<PathStep>
    {
        Task<List<PathStep>> GetByLearningPathIDAsync(Guid LearningPathId);

        Task<PathStep> GetByPathStepIdAsync(Guid pathStepId);
    }
}
