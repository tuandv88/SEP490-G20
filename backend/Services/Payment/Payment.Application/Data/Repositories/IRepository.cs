namespace Payment.Application.Data.Repositories;
public interface IRepository<T> where T : class {
    IQueryable<T> GetQueryable();
    Task<T?> GetByIdAsync(Guid id);
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
    Task DeleteByIdAsync(Guid id);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

