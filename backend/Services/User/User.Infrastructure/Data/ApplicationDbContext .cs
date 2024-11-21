using System.Reflection;
using Microsoft.EntityFrameworkCore;
using User.Domain.Models;

namespace User.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<PointHistory> PointHistories => Set<PointHistory>();

        public DbSet<LearningPath> LearningPaths => Set<LearningPath>();

        public DbSet<PathStep> PathSteps => Set<PathStep>();

        public DbSet<UserGoal> UserGoals => Set<UserGoal>();

        public async new Task AddAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class
        {
            await Set<T>().AddAsync(entity, cancellationToken);
        }

        public new void Update<T>(T entity) where T : class
        {
            Set<T>().Update(entity);
        }

        public new void Remove<T>(T entity) where T : class
        {
            Set<T>().Remove(entity);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(builder);
        }
    }
}
