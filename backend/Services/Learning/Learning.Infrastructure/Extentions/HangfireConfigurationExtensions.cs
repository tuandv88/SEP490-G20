using Hangfire;
using Hangfire.PostgreSql;

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
        services.AddHangfireServer(x => x.SchedulePollingInterval = TimeSpan.FromSeconds(15)); // tạm để theo mặc định rồi tính sau
    }
}

