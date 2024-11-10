namespace Community.Application.Data.Repositories;

public interface ICategoryRepository : IRepository<Category>
{
    public Task<Category?> GetByIdDetailAsync(Guid id);
    public Task<Category?> GetCategoryDetailByIdIsActiveAsync(Guid id);
}

