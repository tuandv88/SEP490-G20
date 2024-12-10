using Learning.Application.Interfaces;
using Learning.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;

namespace Learning.Application.IntegrationTests;
internal class CustomWebApplicationFactory : WebApplicationFactory<Program> {
    protected override void ConfigureWebHost(IWebHostBuilder builder) {
        builder.ConfigureAppConfiguration(configurationBuilder => {
            var integrationConfig = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables()
                .Build();

            configurationBuilder.AddConfiguration(integrationConfig);
        });

        builder.ConfigureServices((builder, services) => {

            services.Remove<IUserContextService>()
                .AddTransient(provider => Mock.Of<IUserContextService>(s =>
                    s.User == GetUserContext()));


            services.Remove<DbContextOptions<ApplicationDbContext>>()
                .AddDbContext<ApplicationDbContext>((sp, options) => {
                    options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
                    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"),
                        builder => builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)); 
                });
            
            // thêm context vào vì môi trường test không có http context => auth không hoạt động
           services.Remove<IHttpContextAccessor>()
             .AddTransient<IHttpContextAccessor>(provider => {
                 var accessor = new HttpContextAccessor {
                     HttpContext = GetHttpContext()
                 };
                 return accessor;
             });
        });
    }
}
