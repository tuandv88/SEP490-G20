namespace Learning.Infrastructure.Data.Repositories.Questions;
public class QuestionRepository : Repository<Question>, IQuestionRepository {
    private IApplicationDbContext _dbContext;
    public QuestionRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var question = await GetByIdAsync(id);
        if (question != null) {
            _dbContext.Questions.Remove(question);
        }
    }

    public override async Task<Question?> GetByIdAsync(Guid id) {
        var question = await _dbContext.Questions
                        .FirstOrDefaultAsync(q => q.Id.Equals(QuestionId.Of(id)));
        return question;
    }
}

