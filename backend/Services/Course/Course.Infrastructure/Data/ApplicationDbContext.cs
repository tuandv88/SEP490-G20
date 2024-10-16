using Course.Domain.Model;
using System.Reflection;

namespace Course.Infrastructure.Data;
public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Domain.Models.Course> Courses => Set<Domain.Models.Course>();

    public DbSet<Chapter> Chapters => Set<Chapter>();

    public DbSet<Lecture> Lectures => Set<Lecture>();

    public DbSet<Lesson> Lessons => Set<Lesson>();

    public DbSet<Quiz> Quizs => Set<Quiz>();

    public DbSet<Question> Question => Set<Question>();

    public DbSet<QuestionOption> QuestionOption => Set<QuestionOption>();

    public DbSet<Video> Videos => Set<Video>();

    public DbSet<Document> Documents => Set<Document>();

    public DbSet<Problem> Problems => Set<Problem>();

    public DbSet<ProblemSolution> ProblemSolutions => Set<ProblemSolution>();

    public DbSet<ProblemTestCase> ProblemTestCases => Set<ProblemTestCase>();
    public DbSet<DiscountCode> DiscountCodes => Set<DiscountCode>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(builder);
    }
}

