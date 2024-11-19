

namespace Learning.Infrastructure.Data.Repositories.Quizs;
public class QuizRepository : Repository<Quiz>, IQuizRepository {
    private IApplicationDbContext _dbContext;
    public QuizRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var quiz = await GetByIdAsync(id);
        if (quiz != null) {
            _dbContext.Quizs.Remove(quiz);
        }
    }

    public override async Task<Quiz?> GetByIdAsync(Guid id) {
        var quiz =await _dbContext.Quizs
                        .FirstOrDefaultAsync(q => q.Id.Equals(QuizId.Of(id)));
        return quiz;
    }

    public async Task<Quiz?> GetByIdDetailAsync(Guid Id) {
        var quiz = await _dbContext.Quizs
                        .Include(q => q.Questions)
                        .ThenInclude(q => q.QuestionOptions)
                        .FirstOrDefaultAsync(q => q.Id.Equals(QuizId.Of(Id)));
        return quiz;
    }
}

