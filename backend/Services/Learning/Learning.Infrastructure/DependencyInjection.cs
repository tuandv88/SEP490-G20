using BuildingBlocks.Extensions;
using Learning.Application.Interfaces;
using Learning.Infrastructure.Data.Interceptors;
using Learning.Infrastructure.Data.Repositories.Chapters;
using Learning.Infrastructure.Data.Repositories.Courses;
using Learning.Infrastructure.Data.Repositories.Files;
using Learning.Infrastructure.Data.Repositories.Lectures;
using Learning.Infrastructure.Data.Repositories.OutboxMessages;
using Learning.Infrastructure.Data.Repositories.Problems;
using Learning.Infrastructure.Data.Repositories.ProblemSolutions;
using Learning.Infrastructure.Data.Repositories.ProblemSubmissions;
using Learning.Infrastructure.Data.Repositories.Questions;
using Learning.Infrastructure.Data.Repositories.Quizs;
using Learning.Infrastructure.Data.Repositories.TestCases;
using Learning.Infrastructure.Data.Repositories.TestScripts;
using Learning.Infrastructure.Services;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using Npgsql;

namespace Learning.Infrastructure;
public static class DependencyInjection {
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration) {

        var connectionString = configuration.GetConnectionString("DefaultConnection");
        var dataSource = new NpgsqlDataSourceBuilder(connectionString)
            .EnableDynamicJson()
            .Build();

        services.AddDbContext<ApplicationDbContext>((sp, options) => {
            options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
            options.UseNpgsql(dataSource).LogTo(Console.WriteLine, LogLevel.Information); ;
        });

        services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();


        services.AddHttpContextAccessor();
        services.AddScoped<IApplicationDbContext, ApplicationDbContext>();

        //Caching
        services.AddConfigureCaching(configuration);

        //Configuration Repository
        ConfigureRepository(services, configuration);

        //Configuration Service
        services.AddScoped<ISourceCombiner, SourceCombiner>();

        //IBase64Converter
        services.AddScoped<IBase64Converter, Base64Converter>();

        //UserContext
        services.AddScoped<IUserContextService, UserContextService>();

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

        //OutboxMessageRepository
        services.AddScoped<IOutboxMessageRepository, OutboxMessageRepository>();
    }
}
