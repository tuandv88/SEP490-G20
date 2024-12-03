using BuildingBlocks.Extensions;
using Learning.Application.Interfaces;
using Learning.Infrastructure.Data.Interceptors;
using Learning.Infrastructure.Data.Repositories.Chapters;
using Learning.Infrastructure.Data.Repositories.Courses;
using Learning.Infrastructure.Data.Repositories.Files;
using Learning.Infrastructure.Data.Repositories.LectureComments;
using Learning.Infrastructure.Data.Repositories.Lectures;
using Learning.Infrastructure.Data.Repositories.Problems;
using Learning.Infrastructure.Data.Repositories.ProblemSolutions;
using Learning.Infrastructure.Data.Repositories.ProblemSubmissions;
using Learning.Infrastructure.Data.Repositories.QuestionOptions;
using Learning.Infrastructure.Data.Repositories.Questions;
using Learning.Infrastructure.Data.Repositories.Quizs;
using Learning.Infrastructure.Data.Repositories.QuizSubmissions;
using Learning.Infrastructure.Data.Repositories.TestCases;
using Learning.Infrastructure.Data.Repositories.TestScripts;
using Learning.Infrastructure.Data.Repositories.UserEnrollments;
using Learning.Infrastructure.Extentions;
using Learning.Infrastructure.Services;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;

namespace Learning.Infrastructure;
public static class DependencyInjection {
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration) {
        services.AddDbContext<ApplicationDbContext>((sp, options) => {
            options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"),
                 npgsqlOptions => {
                     npgsqlOptions.EnableRetryOnFailure(5);
                 });

            options.LogTo(Console.WriteLine, LogLevel.Information);
        });
        services.AddMassTransitWithRabbitMQ(configuration, typeof(IApplicationDbContext).Assembly);

        services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();


        services.AddHttpContextAccessor();

        //trong context đã tạo một ApplicationDbContext rồi, phải lấy ra chứ không add scoped mới 
        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        //Thêm hangfire vào 
        services.AddHangfireWithPostgreSQL(configuration);

        //Caching
        services.AddConfigureCaching(configuration);

        //IBase64Converter
        services.AddScoped<IBase64Converter, Base64Converter>();

        //Configuration Service
        services.AddScoped<ISourceCombiner, SourceCombiner>();

        services.AddScoped<IManagementStateService, ManagementStateService>();

        //Configuration Repository
        ConfigureRepository(services, configuration);

        return services;
    }
    private static void ConfigureRepository(IServiceCollection services, IConfiguration configuration) {
        //Caching CourseRepository
        services.AddScoped<ICourseRepository, CourseRepository>();
        services.Decorate<ICourseRepository, CachedCourseRepository>();

        //ChapterRepository
        services.AddScoped<IChapterRepository, ChapterRepository>();
        services.Decorate<IChapterRepository, CachedChapterRepository>();

        //LectureRepository
        services.AddScoped<ILectureRepository, LectureRepository>();
        services.Decorate<ILectureRepository, CachedLectureRepository>();

        //FileRepository
        services.AddScoped<IFileRepository, FileRepository>();

        //ProblemRepository
        services.AddScoped<IProblemRepository, ProblemRepository>();

        //ProblemSolutionRepository
        services.AddScoped<IProblemSolutionRepository, ProblemSolutionRepository>();

        //ProblemSubmissionRepository
        services.AddScoped<IProblemSubmissionRepository, ProblemSubmissionRepository>();

        //TestScriptRepository
        services.AddScoped<ITestScriptRepository, TestScriptRepository>();

        //TestCaseRepository
        services.AddScoped<ITestCaseRepository, TestCaseRepository>();

        //QuizRepository
        services.AddScoped<IQuizRepository, QuizRepository>();

        //QuestionRepository
        services.AddScoped<IQuestionRepository, QuestionRepository>();

        //QuestionOptionRepository
        services.AddScoped<IQuestionOptionRepository, QuestionOptionRepository>();

        //IQuizSubmissionRepositoru
        services.AddScoped<IQuizSubmissionRepository, QuizSubmissionRepository>();

        //IUserCourse
        services.AddScoped<IUserEnrollmentRepository, UserEnrollmentRepository>();

        //ILectureComments
        services.AddScoped<ILectureCommentRepository, LectureCommentRepository>();
    }
}
