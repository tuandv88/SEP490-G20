using Microsoft.OpenApi.Models;
using Serilog;
using BuildingBlocks.Logging;

var builder = WebApplication.CreateBuilder(args);

//Logging
builder.Host.UseSerilog(SeriLogger.Configure)
    .ConfigureServices(services =>
    {
        //Add Service to DI Extension
        services
        .AddApplicationServices(builder.Configuration)
        .AddInfrastructureServices(builder.Configuration)
        .AddApiServices(builder.Configuration);

        //Docs API
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.EnableAnnotations();
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "Discussion API", Version = "v1" });
        });

        services.AddControllers();

        // Thêm CORS
        services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp", policy =>
            {
                policy.WithOrigins("http://localhost:5173")  // Địa chỉ của ứng dụng React
                      .AllowAnyHeader()   // Cho phép bất kỳ header nào
                      .AllowAnyMethod();  // Cho phép bất kỳ phương thức HTTP nào (GET, POST, PUT, DELETE...)
            });
        });
    });

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

// DI - UseApiServices
app.UseApiServices();

app.Run();
