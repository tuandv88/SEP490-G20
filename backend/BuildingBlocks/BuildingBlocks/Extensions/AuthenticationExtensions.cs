using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace BuildingBlocks.Extensions;
public static class AuthenticationExtensions
{
    public static IServiceCollection AddConfigureAuthentication(this IServiceCollection services, IConfiguration configuration, JwtBearerOptions? options = null)
    {
        services
        .AddAuthentication(x =>
        {
            x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(x =>
        {
            x.Authority = configuration["Jwt:Authority"];
            x.RequireHttpsMetadata = configuration.GetValue("Jwt:RequireHttpsMetadata", true);
            x.SaveToken = true;
            x.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = false,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero,
                ValidIssuer = configuration["Jwt:Issuer"],
                //ValidAudience = configuration["Jwt:Audience"],
                ValidAlgorithms = new[] { SecurityAlgorithms.RsaSha256 }
            };
            x.Events = options != null ? options.Events : x.Events;
        });

        services.AddAuthorization(x => {});

        return services;
    }
}

