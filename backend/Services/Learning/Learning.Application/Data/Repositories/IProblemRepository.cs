namespace Learning.Application.Data.Repositories;
public interface IProblemRepository : IRepository<Problem>{
    Task<Problem?> GetByIdDetailAsync(Guid id);
}

