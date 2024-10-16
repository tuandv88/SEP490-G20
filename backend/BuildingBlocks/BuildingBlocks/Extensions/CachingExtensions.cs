using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BuildingBlocks.Extensions;
public static class CachingExtensions {
    public static IServiceCollection ConfigureCaching(this IServiceCollection services, IConfiguration configuration) {
        services.AddStackExchangeRedisCache(x => {
            x.Configuration = configuration.GetConnectionString("Redis");
        });
        return services;
    }
}