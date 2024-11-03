using BuildingBlocks.Logging;
using Microsoft.OpenApi.Models;
using Serilog;
using AI.Application;
using AI.Infrastructure;
using AI.API;
var builder = WebApplication.CreateBuilder(args);

//Logging
builder.Host.UseSerilog(SeriLogger.Configure);

//Add Service
builder.Services
    .AddApplicationServices(builder.Configuration)
    .AddInfrastructureServices(builder.Configuration)
    .AddApiServices(builder.Configuration);

//Docs API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => {
    options.EnableAnnotations();
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Course API", Version = "v1" });
});


var app = builder.Build();
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseApiServices();

app.Run();
