﻿namespace Learning.Application.Data;
public interface IApplicationDbContext {
    DbSet<Course> Courses { get; }
    DbSet<Chapter> Chapters { get; }
    DbSet<Lecture> Lectures { get; }
    DbSet<Quiz> Quizs { get; }
    DbSet<Question> Questions { get; }
    DbSet<QuestionOption> QuestionOption { get; }
    DbSet<Problem> Problems { get; }
    DbSet<ProblemSolution> ProblemSolutions { get; }
    DbSet<TestScript> TestScripts { get; }
    DbSet<TestCase> TestCases { get; }
    DbSet<UserEnrollment> UserEnrollments { get; }
    DbSet<LectureProgress> LecturesProgress { get; }
    DbSet<LectureComment> LectureComments { get; }
    DbSet<QuizSubmission> QuizSubmissions { get; }
    DbSet<ProblemSubmission> ProblemSubmissions { get; }
    DbSet<Domain.Models.File> Files { get; }
    DbSet<TEntity> Set<TEntity>() where TEntity : class;

    Task AddAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class;
    void Update<T>(T entity) where T : class;
    void Remove<T>(T entity) where T : class;
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

