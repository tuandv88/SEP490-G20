﻿using AI.Application.Data;

namespace AI.Infrastructure.Data.Repositories;
public abstract class Repository<T> : IRepository<T> where T : class {
    private readonly IApplicationDbContext dbContext;
    private readonly DbSet<T> _dbSet;

    public Repository(IApplicationDbContext _dbContext) {
        dbContext = _dbContext;
        _dbSet = _dbContext.Set<T>();
    }
    public async Task<List<T>> GetAllAsync() {
        return await _dbSet.ToListAsync();
    }
    public abstract Task<T?> GetByIdAsync(Guid id);
    public async Task AddAsync(T entity) {
        await _dbSet.AddAsync(entity);
    }
    public async Task UpdateAsync(T entity) {
        _dbSet.Update(entity);
    }
    public async Task DeleteAsync(T entity) {
        _dbSet.Remove(entity);
    }
    public abstract Task DeleteByIdAsync(Guid id);
    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken) {
        return await dbContext.SaveChangesAsync(cancellationToken);
    }


}

