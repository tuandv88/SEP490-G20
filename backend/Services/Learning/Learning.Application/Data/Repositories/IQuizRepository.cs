namespace Learning.Application.Data.Repositories;
public interface IQuizRepository : IRepository<Quiz> {
    Task<Quiz?> GetByIdDetailAsync(Guid Id);
    IQueryable<Quiz> GetAllAsQueryable();
    Task<Quiz> GetQuizAssessment();
}
