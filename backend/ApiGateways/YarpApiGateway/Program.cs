using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using YarpApiGateway.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddRateLimiter(rateLimiterOptions => {
    rateLimiterOptions.AddFixedWindowLimiter("fixed", options => {
        options.Window = TimeSpan.FromSeconds(1);
        options.PermitLimit = 5;
    });
});

builder.Services.AddCors(options => {
    options.AddPolicy("CombinedPolicy", b => {
        b.WithOrigins(builder.Configuration["Cors:User"]!, builder.Configuration["Cors:Admin"]!)
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});


var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions {
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
});

app.UseCors("CombinedPolicy");
app.UseRejectWebsocketOverHttp2WhileUnsupported();
// Configure the HTTP request pipeline.
app.UseRateLimiter();

app.MapReverseProxy();

app.Run();
