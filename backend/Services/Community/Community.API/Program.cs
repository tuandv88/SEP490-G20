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

        services.AddCors(options =>
        {
            options.AddPolicy("AllowLocalhost5173", b =>
            {
                b.WithOrigins("http://localhost:5173")
                        .AllowAnyMethod()    // Cho phép mọi phương thức HTTP (GET, POST, PUT, DELETE, v.v.)
                        .AllowAnyHeader()    // Cho phép mọi header
                        .AllowCredentials(); // Cho phép gửi cookies và thông tin xác thực nếu cần
            });

        });

    });

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS
app.UseCors("AllowLocalhost5173");

// DI - UseApiServices
app.UseApiServices();

app.Run();
