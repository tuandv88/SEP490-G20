using Course.Domain.Model;
using Microsoft.EntityFrameworkCore;

namespace Course.Application.Data;
public interface IApplicationDbContext {
    DbSet<Domain.Models.Course> Courses { get; }
    DbSet<Chapter> Chapters { get; }
    DbSet<Lecture> Lectures { get; }
    DbSet<Lesson> Lessons { get; }
    DbSet<Quiz> Quizs { get; }
    DbSet<Question> Question { get; }
    DbSet<QuestionOption> QuestionOption { get; }
    DbSet<Video> Videos { get; }
    DbSet<Document> Documents { get; }
    DbSet<Problem> Problems { get; }
    DbSet<ProblemSolution> ProblemSolutions { get; }
    DbSet<ProblemTestCase> ProblemTestCases { get; }
    DbSet<DiscountCode> DiscountCodes { get; }
}

