namespace Learning.Application.Data.Repositories;
public interface IQuizRepository : IRepository<Quiz> {
    Task<Quiz?> GetByIdDetailAsync(Guid Id);
    Task<IQueryable<Quiz>> GetAllQueryAbleAsync();
}
