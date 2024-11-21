using AI.Application.Data;
using AI.Application.Models.Documents.EventHandlers.Integration;
using AI.Infrastructure.Data;
using AI.Infrastructure.Data.Interceptors;
using AI.Infrastructure.Data.Repositories.Conversations;
using AI.Infrastructure.Data.Repositories.Documents;
using AI.Infrastructure.Data.Repositories.Messages;
using AI.Infrastructure.Data.Repositories.Recommendations;
using AI.Infrastructure.Extensions;
using AI.Infrastructure.Extensions.Kernels;
using AI.Infrastructure.Services;
using BuidingBlocks.Storage;
using BuildingBlocks.Extensions;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Npgsql;

namespace AI.Infrastructure;
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
        //Add Messagebroker
        services.AddMassTransitWithRabbitMQ(configuration, typeof(IApplicationDbContext).Assembly);

        services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();


        services.AddHttpContextAccessor();
        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        //Configuration kernel
        services.AddKernelConfiguration(configuration);
        //Caching
        services.AddConfigureCaching(configuration);

        //Configuration Repository
        ConfigureRepository(services, configuration);

        //UserContext
        services.AddScoped<IUserContextService, UserContextService>();

        //Configuration Service
        ConfigureService(services, configuration);

        //Add storage
        services.AddStorage(configuration);
        return services;
    }
    private static void ConfigureRepository(IServiceCollection services, IConfiguration configuration) {
        //Conversation Repository
        services.AddScoped<IConversationRepository, ConversationRepository>();

        //Message Repositoy
        services.AddScoped<IMessageRepository, MessageRepository>();

        //Recommendation Repository
        services.AddScoped<IRecommendationRepository, RecommendationRepository>();

        //Document Repository
        services.AddScoped<IDocumentRepository, DocumentRepository>();

    }
    private static void ConfigureService(this IServiceCollection services, IConfiguration configuration) {
        //ChatService
        services.AddScoped<IChatService, ConversationalAIService>();

        //MessageService
        services.AddScoped<IMessageService, MessageService>();

        //DocumentService
        services.AddScoped<IDocumentService, DocumentService>();
    }

}

