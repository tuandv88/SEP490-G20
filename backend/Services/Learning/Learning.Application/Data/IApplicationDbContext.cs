using Learning.Domain.Model;
using Microsoft.EntityFrameworkCore;

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



    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}

