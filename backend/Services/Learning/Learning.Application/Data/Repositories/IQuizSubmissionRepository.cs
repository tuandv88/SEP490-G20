
namespace Learning.Application.Data.Repositories;
public interface IQuizSubmissionRepository : IRepository<QuizSubmission> {
    Task<QuizSubmission?> GetSubmissionInProgressAsync(Guid quizId, Guid userId);
    Task<List<QuizSubmission>> GetByQuizAndUserIdAsync(Guid quizId, Guid userId);
    Task<int> CountByQuizAndUser(Guid quizId, Guid userId);
    IQueryable<QuizSubmission> GetAllAsQueryable();
}

