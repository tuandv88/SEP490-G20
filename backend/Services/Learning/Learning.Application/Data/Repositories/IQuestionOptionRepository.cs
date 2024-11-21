namespace Learning.Application.Data.Repositories;
public interface IQuestionOptionRepository : IRepository<QuestionOption>{
    Task<List<QuestionOption>> GetByQuestionAsync(QuestionId id);
}

