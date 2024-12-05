using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Payment.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Payment.Application.Data;
using Payment.Infrastructure.Extentions;
using Payment.Infrastructure.Data.Interceptors;
using Payment.Infrastructure.Services;
using Payment.Application.Data.Repositories;
using Payment.Infrastructure.Data.Respositories.Transactions;
using Payment.Infrastructure.Data.Respositories.TransactionLogs;
using BuildingBlocks.Email.Interfaces;
using BuildingBlocks.Email.Services;
using Payment.Infrastructure.Data.Respositories.TransactionItems;

namespace Payment.Infrastructure;
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

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
        services.AddMassTransitWithRabbitMQ(configuration, typeof(IApplicationDbContext).Assembly);

        services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();

        services.AddHttpContextAccessor();

        services.AddPaypal(configuration);

        services.AddScoped<IPaypalClientApi, PaypalClientApi>();

        services.AddScoped<ITransactionRepository, TransactionRepository>();
        services.AddScoped<ITransactionLogRepository, TransactionLogRepository>();
        services.AddScoped<ITransactionItemRepository, TransactionItemRepository>();
        services.AddScoped<IEmailService, EmailService>();
        return services;
    }
}

