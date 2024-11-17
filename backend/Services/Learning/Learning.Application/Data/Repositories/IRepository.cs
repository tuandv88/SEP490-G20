﻿namespace Learning.Application.Data.Repositories;
public interface IRepository<T> where T : class {
    Task<List<T>> GetAllAsync();
    Task<T?> GetByIdAsync(Guid id);
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
    Task DeleteByIdAsync(Guid id);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

