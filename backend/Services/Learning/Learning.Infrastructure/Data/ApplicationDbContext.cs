using MassTransit;
using System.Reflection;
using Learning.Application.Data;
namespace Learning.Infrastructure.Data;
public class ApplicationDbContext : DbContext, IApplicationDbContext {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Course> Courses => Set<Course>();

    public DbSet<Chapter> Chapters => Set<Chapter>();

    public DbSet<Lecture> Lectures => Set<Lecture>();

    public DbSet<Quiz> Quizs => Set<Quiz>();

    public DbSet<Question> Questions => Set<Question>();

    public DbSet<QuestionOption> QuestionOption => Set<QuestionOption>();

    public DbSet<Problem> Problems => Set<Problem>();

    public DbSet<TestScript> TestScripts => Set<TestScript>();
    public DbSet<TestCase> TestCases => Set<TestCase>();

    public DbSet<ProblemSolution> ProblemSolutions => Set<ProblemSolution>();

    public DbSet<UserEnrollment> UserEnrollments => Set<UserEnrollment>();

    public DbSet<LectureProgress> LecturesProgress => Set<LectureProgress>();

    public DbSet<QuizSubmission> QuizSubmissions => Set<QuizSubmission>();

    public DbSet<ProblemSubmission> ProblemSubmissions => Set<ProblemSubmission>();

    public DbSet<Domain.Models.File> Files => Set<Domain.Models.File>();

    public DbSet<LectureComment> LectureComments => Set<LectureComment>();

    public async new Task AddAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class {
        await Set<T>().AddAsync(entity, cancellationToken);
    }
    public new void  Update<T>(T entity) where T : class {
        Set<T>().Update(entity);
    }
    public new void Remove<T>(T entity) where T : class {
        Set<T>().Remove(entity);
    }

    protected override void OnModelCreating(ModelBuilder builder) {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(builder);

        builder.AddInboxStateEntity();
        builder.AddOutboxMessageEntity();
        builder.AddOutboxStateEntity();
    }
}

