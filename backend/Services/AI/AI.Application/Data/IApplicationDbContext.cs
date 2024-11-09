using AI.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace AI.Application.Data;
public interface IApplicationDbContext {
    DbSet<Conversation> Conversations { get; }
    DbSet<Message> Messages { get; }
    DbSet<Document> Documents { get; }
    DbSet<Recommendation> Recommendations { get; }
    
    DbSet<TEntity> Set<TEntity>() where TEntity : class;
    Task AddAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class;
    void Update<T>(T entity) where T : class;
    void Remove<T>(T entity) where T : class;
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}

