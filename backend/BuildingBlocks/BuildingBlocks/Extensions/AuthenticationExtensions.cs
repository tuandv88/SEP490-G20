using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace BuildingBlocks.Extensions;
public static class AuthenticationExtensions
{
    public static IServiceCollection AddConfigureAuthentication(this IServiceCollection services, IConfiguration configuration)
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
            };
        });

        services.AddAuthorization(x =>
        {
            x.AddPolicy("Administrator", policy => policy.RequireRole("Administrator"));
            x.AddPolicy("Author", policy => policy.RequireRole("Author"));
            x.AddPolicy("Moderator", policy => policy.RequireRole("Moderator"));
            x.AddPolicy("Learner", policy => policy.RequireRole("Learner"));
            x.AddPolicy("Blogger", policy => policy.RequireRole("Blogger"));
        });

        return services;
    }
}

