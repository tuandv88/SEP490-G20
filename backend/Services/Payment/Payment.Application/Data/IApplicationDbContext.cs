using Microsoft.EntityFrameworkCore;
using Payment.Domain.Models;

namespace Payment.Application.Data;
public interface IApplicationDbContext {
    DbSet<Transaction> Transactions { get; }
    DbSet<TransactionItem> TransactionItems { get; }
    DbSet<TransactionLog> TransactionLogs { get; }
    DbSet<TEntity> Set<TEntity>() where TEntity : class;

    Task AddAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class;
    void Update<T>(T entity) where T : class;
    void Remove<T>(T entity) where T : class;
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
