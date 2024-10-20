using Learning.Domain.Model;

namespace Learning.Application.Data;
public interface IApplicationDbContext {
    DbSet<Domain.Models.Course> Courses { get; }
    DbSet<Chapter> Chapters { get; }
    DbSet<Lecture> Lectures { get; }
    DbSet<Lesson> Lessons { get; }
    DbSet<Quiz> Quizs { get; }
    DbSet<Question> Questions { get; }
    DbSet<QuestionOption> QuestionOption { get; }
    DbSet<Video> Videos { get; }
    DbSet<Document> Documents { get; }
    DbSet<Problem> Problems { get; }
    DbSet<ProblemSolution> ProblemSolutions { get; }
    DbSet<TestScript> TestScripts { get; }
    DbSet<TestCase> TestCases { get; }
    DbSet<UserCourse> UserCourses { get; }
    DbSet<LectureProgress> LecturesProgress { get; }
    DbSet<QuizSubmission> QuizSubmissions { get; }
    DbSet<ProblemSubmission> ProblemSubmissions { get; }
    DbSet<TEntity> Set<TEntity>() where TEntity : class;

    Task AddAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class;
    void Update<T>(T entity) where T : class;
    void Remove<T>(T entity) where T : class;
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}

