namespace Community.Application.Data
{
    public interface IApplicationDbContext
    {
        DbSet<Discussion> Discussions { get; }
        DbSet<Category> Categories { get; }
        DbSet<TEntity> Set<TEntity>() where TEntity : class;

        Task AddAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class;
        void Update<T>(T entity) where T : class;
        void Remove<T>(T entity) where T : class;
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}

