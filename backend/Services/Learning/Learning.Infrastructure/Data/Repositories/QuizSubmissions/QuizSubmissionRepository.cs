


using Learning.Domain.ValueObjects;

namespace Learning.Infrastructure.Data.Repositories.QuizSubmissions;
public class QuizSubmissionRepository : Repository<QuizSubmission>, IQuizSubmissionRepository {
    public readonly IApplicationDbContext _dbContext;
    public QuizSubmissionRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var submission = await GetByIdAsync(id);
        if (submission != null) {
            _dbContext.QuizSubmissions.Remove(submission);
        }
    }

    
    public override async Task<QuizSubmission?> GetByIdAsync(Guid id) {
        var quiz = await _dbContext.QuizSubmissions
                       .FirstOrDefaultAsync(q => q.Id.Equals(QuizSubmissionId.Of(id)));
        return quiz;
    }

    public async Task<QuizSubmission?> GetSubmissionInProgressAsync(Guid quizId, Guid userId) {
        return await _dbContext.QuizSubmissions
            .FirstOrDefaultAsync(q => q.QuizId.Equals(QuizId.Of(quizId)) &&
                                      q.UserId.Equals(UserId.Of(userId)) &&
                                      q.Status == QuizSubmissionStatus.InProgress);
    }

    public async Task<List<QuizSubmission>> GetByQuizAndUserIdAsync(Guid quizId, Guid userId) {
        return await _dbContext.QuizSubmissions
            .Where(q => q.QuizId.Equals(QuizId.Of(quizId)) && q.UserId.Equals(UserId.Of(userId)))
            .ToListAsync();
    }

    public async Task<int> CountByQuizAndUser(Guid quizId, Guid userId) {
        var count = await _dbContext.QuizSubmissions
                      .Where(q => q.QuizId.Equals(QuizId.Of(quizId)) && 
                      q.UserId.Equals(UserId.Of(userId))).CountAsync();
        return count;
    }
}

