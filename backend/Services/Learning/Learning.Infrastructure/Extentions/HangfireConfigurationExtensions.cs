using Hangfire;
using Hangfire.Dashboard.BasicAuthorization;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Builder;

namespace Learning.Infrastructure.Extentions;
public static class HangfireConfigurationExtensions {
    public static void AddHangfireWithPostgreSQL(this IServiceCollection services, IConfiguration configuration) {
        services.AddHangfire(x => {
            x.UsePostgreSqlStorage(options => {
                options.UseNpgsqlConnection(configuration.GetConnectionString("DefaultConnection"));
            });
            x.UseSimpleAssemblyNameTypeSerializer()
            .UseRecommendedSerializerSettings();

        });
        // polling check database 5s một phát
        services.AddHangfireServer(x => x.SchedulePollingInterval = TimeSpan.FromSeconds(5)); // tạm để theo mặc định rồi tính sau 15s
    }

    public static WebApplication AddHangfireDashboard(this WebApplication app) {
        var username = app.Configuration["Hangfire:UserName"]!;
        var password = app.Configuration["Hangfire:Password"]!;
        app.UseHangfireDashboard("/hangfire", new DashboardOptions {
            Authorization = new[] { new BasicAuthAuthorizationFilter(new BasicAuthAuthorizationFilterOptions{
            RequireSsl = false,
            SslRedirect = false,
            LoginCaseSensitive = true,
            Users = new []{
                new BasicAuthAuthorizationUser{
                    Login = username,
                    PasswordClear =  password
                }
            }})}
        });
        return app;
    }
}

