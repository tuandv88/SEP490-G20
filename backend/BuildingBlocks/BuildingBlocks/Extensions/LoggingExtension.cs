using Elastic.Channels;
using Elastic.Ingest.Elasticsearch.DataStreams;
using Elastic.Serilog.Sinks;
using Elastic.Transport;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Exceptions;
using System.Reflection;

namespace BuildingBlocks.Extensions;
public static class LoggingExtension
{
    public static void ConfigureLogging(this IServiceCollection services, IConfiguration configuration)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        Log.Logger = new LoggerConfiguration()
            .Enrich.FromLogContext()
            .Enrich.WithExceptionDetails()
            .WriteTo.Debug()
            .WriteTo.Console()
            //.WriteTo.Elasticsearch(new[] { new Uri("http://localhost:9200") }, opts => {
            //    opts.DataStream = new DataStreamName($"{Assembly.GetExecutingAssembly().GetName()?.Name?.ToLower().Replace(".", "-")}-{environment?.ToLower()}-{DateTime.UtcNow:yyyy-MM-dd}");
            //    //opts.BootstrapMethod = BootstrapMethod.Failure;
            //    opts.ConfigureChannel = channelOpts => {
            //        channelOpts.BufferOptions = new BufferOptions {

            //        };
            //    };
            //}, transport => {
            //    transport.Authentication(new BasicAuthentication("elastic", "gMXeF3*lFOJBbQhXCgWL")); // Basic Auth
            //    // transport.Authentication(new ApiKey(base64EncodedApiKey)); // ApiKey
            //})
            .Enrich.WithProperty("Environment", environment)
            .ReadFrom.Configuration(configuration)
            .CreateLogger();
    }
}

