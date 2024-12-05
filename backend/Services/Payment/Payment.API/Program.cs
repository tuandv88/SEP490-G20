using BuildingBlocks.Logging;
using Serilog;
using Payment.Application;
using Payment.Infrastructure;
using Microsoft.OpenApi.Models;
using Payment.API;
using Elastic.CommonSchema;

var builder = WebApplication.CreateBuilder(args);

//Logging
//builder.Host.UseSerilog(SeriLogger.Configure)
//    .ConfigureServices(services => {
        
//    });

//Add Service
builder.Services
    .AddApplicationServices(builder.Configuration)
    .AddInfrastructureServices(builder.Configuration)
    .AddApiServices(builder.Configuration);

//Docs API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => {
    options.EnableAnnotations();
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Payment API", Version = "v1" });
});
var app = builder.Build();
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseApiServices();

app.Run();
