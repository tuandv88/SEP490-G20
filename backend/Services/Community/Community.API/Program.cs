using Microsoft.OpenApi.Models;
using Serilog;
using BuildingBlocks.Logging;

var builder = WebApplication.CreateBuilder(args);

//Logging
builder.Host.UseSerilog(SeriLogger.Configure)
    .ConfigureServices(services => {
    //Add Service
    services
        .AddApplicationServices(builder.Configuration)
        .AddInfrastructureServices(builder.Configuration)
        .AddApiServices(builder.Configuration);

    //Docs API
    services.AddEndpointsApiExplorer();
    services.AddSwaggerGen(options => {
        options.EnableAnnotations();
        options.SwaggerDoc("v1", new OpenApiInfo { Title = "AI API", Version = "v1" });
    });

    services.AddControllers();
});

//Docs API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => {
    options.EnableAnnotations();
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Discussion API", Version = "v1" });
});

//Add Service to DI Extension
builder.Services
    .AddApplicationServices(builder.Configuration)
    .AddInfrastructureServices(builder.Configuration)
    .AddApiServices(builder.Configuration);

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// DI - UseApiServices
app.UseApiServices();

app.Run();
