using Microsoft.OpenApi.Models;
using User.Application;
using User.Infrastructure;
using User.API;
using Serilog;
using BuildingBlocks.Extensions;
using Learning.Application;
using BuildingBlocks.Logging;
using Elastic.CommonSchema;
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
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "User API", Version = "v1" });
        });
    });

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseApiServices();

app.Run();
