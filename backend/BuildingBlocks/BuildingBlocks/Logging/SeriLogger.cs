using Elastic.Ingest.Elasticsearch;
using Elastic.Ingest.Elasticsearch.DataStreams;
using Elastic.Serilog.Sinks;
using Elastic.Transport;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Exceptions;

namespace BuildingBlocks.Logging;
public static class SeriLogger
{
    public static Action<HostBuilderContext, LoggerConfiguration> Configure =>
           (context, configuration) =>
           {
               var elasticUri = context.Configuration.GetValue<string>("ElasticConfiguration:Uri");
               var username = context.Configuration.GetValue<string>("ElasticConfiguration:Username");
               var password = context.Configuration.GetValue<string>("ElasticConfiguration:Password");

               configuration
                   .Enrich.FromLogContext()
                   .Enrich.WithMachineName()
                   .Enrich.WithExceptionDetails()
                   .WriteTo.Debug()
                   .WriteTo.Console()
                   .WriteTo.Elasticsearch(new[] { new Uri(elasticUri!) }, opts =>
                   {
                       opts.DataStream = new DataStreamName($"applogs-{context.HostingEnvironment.ApplicationName?.ToLower().Replace(".", "-")}-{context.HostingEnvironment.EnvironmentName?.ToLower().Replace(".", "-")}-{DateTime.UtcNow:yyyy-MM}");
                       opts.BootstrapMethod = BootstrapMethod.None;
                       //opts.ConfigureChannel = channelOpts => {
                       //    channelOpts.BufferOptions = new BufferOptions {

                       //    };
                       //};
                   }, transport =>
                   {
                       transport.Authentication(new BasicAuthentication(username!, password!));
                       transport.ServerCertificateValidationCallback((sender, certificate, chain, sslPolicyErrors) => true);
                   })
                   .Enrich.WithProperty("Environment", context.HostingEnvironment.EnvironmentName)
                   .Enrich.WithProperty("Application", context.HostingEnvironment.ApplicationName)
                   .ReadFrom.Configuration(context.Configuration);
           };
}