namespace Learning.Infrastructure.Data.Repositories.Questions;
public class QuestionRepository : Repository<Question>, IQuestionRepository {
    private IApplicationDbContext _dbContext;
    public QuestionRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public async Task<int> CountByQuizAsync(QuizId quizId) {
        return await _dbContext.Questions.CountAsync(c => c.QuizId.Equals(quizId));
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var question = await GetByIdAsync(id);
        if (question != null) {
            _dbContext.Questions.Remove(question);
        }
    }

    public async Task<Question?> GetByIdAndQuizId(QuizId quizId, QuestionId questionId) {
        return await _dbContext.Questions.Include(q => q.QuestionOptions)
            .FirstOrDefaultAsync(q => q.QuizId.Equals(quizId) && q.Id.Equals(questionId));
    }

    public override async Task<Question?> GetByIdAsync(Guid id) {
        var question = await _dbContext.Questions
                        .FirstOrDefaultAsync(q => q.Id.Equals(QuestionId.Of(id)));
        return question;
    }
}

