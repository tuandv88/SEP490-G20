using BuildingBlocks.Caching;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BuildingBlocks.Extensions;
public static class CachingExtensions {
    public static IServiceCollection ConfigureCaching(this IServiceCollection services, IConfiguration configuration) {
        services.AddStackExchangeRedisCache(x => {
            x.Configuration = configuration.GetConnectionString("Redis");
        });
        services.AddMemoryCache();
        services.AddScoped<ICacheService, CacheService>();
        return services;
    }
}