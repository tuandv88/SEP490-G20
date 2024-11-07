using AI.Application.Data;
using System.Reflection;

namespace AI.Infrastructure.Data;
public class ApplicationDbContext : DbContext, IApplicationDbContext {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
       : base(options) { }
    public DbSet<Conversation> Conversations => Set<Conversation>();

    public DbSet<Message> Messages => Set<Message>();

    public DbSet<Document> Documents => Set<Document>();

    public DbSet<Recommendation> Recommendations => Set<Recommendation>();

    public async new Task AddAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class {
        await Set<T>().AddAsync(entity, cancellationToken);
    }
    public new void Update<T>(T entity) where T : class {
        Set<T>().Update(entity);
    }
    public new void Remove<T>(T entity) where T : class {
        Set<T>().Remove(entity);
    }

    protected override void OnModelCreating(ModelBuilder builder) {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(builder);
    }
}