using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Yarp.ReverseProxy.Transforms;
using YarpApiGateway.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
      .AddTransforms(transforms => {
          transforms.AddRequestTransform(context => {
              context.HttpContext.Request.EnableBuffering();
              context.HttpContext.Features.Get<IHttpMaxRequestBodySizeFeature>()!.MaxRequestBodySize = 5L * 1024 * 1024 * 1024; // 5GB
              return new ValueTask();
          });
      });

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
builder.Services.Configure<KestrelServerOptions>(options => {
    options.Limits.MaxRequestBodySize = 5L * 1024 * 1024 * 1024; // 5GB
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
