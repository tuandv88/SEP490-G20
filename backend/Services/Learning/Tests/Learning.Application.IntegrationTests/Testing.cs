using Learning.Infrastructure.Data;
using Learning.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Respawn;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Elastic.CommonSchema;
using StackExchange.Redis;

namespace Learning.Application.IntegrationTests;

[SetUpFixture]
public partial class Testing {
    private static WebApplicationFactory<Program> _factory = null!;
    private static IConfiguration _configuration = null!;
    private static IServiceScopeFactory _scopeFactory = null!;
    private static Respawner _checkpoint = null!;
    private static IUserContext? _currentUser;
    private static DefaultHttpContext? _httpContext;


    [OneTimeSetUp]
    public void RunBeforeAnyTests() {
        _factory = new CustomWebApplicationFactory();
        _scopeFactory = _factory.Services.GetRequiredService<IServiceScopeFactory>();
        _configuration = _factory.Services.GetRequiredService<IConfiguration>();

        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        context.Database.Migrate();

        using var connection = new Npgsql.NpgsqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        connection.Open(); 

        _checkpoint = Respawner.CreateAsync(
            connection,
            new RespawnerOptions {
                DbAdapter = DbAdapter.Postgres,
                TablesToIgnore = ["__EFMigrationsHistory"]
            }
        ).GetAwaiter().GetResult();
    }


    public static async Task<TResponse> SendAsync<TResponse>(IRequest<TResponse> request) {
        using var scope = _scopeFactory.CreateScope();

        var mediator = scope.ServiceProvider.GetRequiredService<ISender>();
        return await mediator.Send(request);
    }

    public static async Task SendAsync(IBaseRequest request) {
        using var scope = _scopeFactory.CreateScope();

        var mediator = scope.ServiceProvider.GetRequiredService<ISender>();
        await mediator.Send(request);
    }

    public static IUserContext? GetUserContext() {
        return _currentUser;
    }
    public static HttpContext GetHttpContext() {
        return _httpContext!;
    }
    public static Task<IUserContext> RunAsDefaultUserAsync() {
        return RunAsUserAsync("learner@icoder.vn", "TruongBuiLearner", "learner");
    }

    public static Task<IUserContext> RunAsAdministratorAsync() {
        return RunAsUserAsync("admin@icoder.vn", "TruongBuiAdmin", "admin");
    }
    public static void RunHttpContext() {
        _httpContext = new DefaultHttpContext();
    }
    public static Task<IUserContext> RunAsUserAsync(string email, string userName, string role) {
        _currentUser = new TestUserContext {
            Id = Guid.NewGuid(),
            UserName = userName,
            Email = email,
            FirstName = "bui",
            LastName = "truong",
            Role = role
        };

        _httpContext = new DefaultHttpContext {
            User = new ClaimsPrincipal(new ClaimsIdentity(new[] {
            new Claim(ClaimTypes.Name, userName),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role)
        }))
        };
        return Task.FromResult(_currentUser);
    }

    public static async Task ResetState() {
        try {
            await _checkpoint.ResetAsync(_configuration.GetConnectionString("DefaultConnection")!);
        } catch (Exception) {
        }

        _currentUser = null;
    }

    public static async Task<TEntity?> FindAsync<TEntity>(params object[] keyValues)
        where TEntity : class {
        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        return await context.FindAsync<TEntity>(keyValues);
    }
    public static async Task<TEntity?> FirstAsync<TEntity>()
        where TEntity : class {
        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        return await context.Set<TEntity>().FirstOrDefaultAsync();
    }
    public static async Task AddAsync<TEntity>(TEntity entity)
        where TEntity : class {
        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        context.Add(entity);
        await context.SaveChangesAsync();
    }

    public static async Task<int> CountAsync<TEntity>() where TEntity : class {
        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        return await context.Set<TEntity>().CountAsync();
    }

    [OneTimeTearDown]
    public void RunAfterAnyTests() {
    }

    private class TestUserContext : IUserContext {
        public Guid Id { get; init; }
        public string UserName { get; init; } = null!;
        public string Email { get; init; } = null!;
        public string FirstName { get; init; } = null!;
        public string LastName { get; init; } = null!;
        public string Role { get; init; } = null!;
    }
}