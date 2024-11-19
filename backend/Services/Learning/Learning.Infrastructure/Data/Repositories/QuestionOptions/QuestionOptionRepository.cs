

namespace Learning.Infrastructure.Data.Repositories.QuestionOptions;
public class QuestionOptionRepository : Repository<QuestionOption>, IQuestionOptionRepository {
    private readonly IApplicationDbContext _dbContext;
    public QuestionOptionRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var questionOption = await GetByIdAsync(id);
        if (questionOption != null) {
            _dbContext.QuestionOption.Remove(questionOption);
        }
    }

    public override async Task<QuestionOption?> GetByIdAsync(Guid id) {
        var questionOption = await _dbContext.QuestionOption
                        .FirstOrDefaultAsync(q => q.Id.Equals(QuestionOptionId.Of(id)));
        return questionOption;
    }
    public async Task<List<QuestionOption>> GetByQuestionAsync(QuestionId id) {
        var testCasee = await _dbContext.QuestionOption
                            .Where(t => t.QuestionId.Equals(id))
                            .ToListAsync();
        return testCasee;
    }
}

