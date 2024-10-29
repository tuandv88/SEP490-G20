using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.SemanticKernel;

namespace BuildingBlocks.Extensions;
public static class ChatCompletionExtensions
{
    public static IServiceCollection AddChatCompletion(this IServiceCollection services, IConfiguration configuration)
    {
        var aiServiceConfig = configuration.GetSection("AIService");
        string serviceType = aiServiceConfig["Type"]!;

        if (serviceType.Equals("Azure", StringComparison.OrdinalIgnoreCase))
        {
            string azEndpoint = aiServiceConfig["AzureOpenAi:Endpoint"]!;
            string azApiKey = aiServiceConfig["AzureOpenAi:ApiKey"]!;
            string azModel = aiServiceConfig["AzureOpenAi:Model"]!;

            services.AddAzureOpenAIChatCompletion(azModel, azEndpoint, azApiKey);
        }
        else if (serviceType.Equals("OpenAI", StringComparison.OrdinalIgnoreCase))
        {
            string oaiModelType = aiServiceConfig["OpenAi:ModelType"]!;
            string oaiApiKey = aiServiceConfig["OpenAi:ApiKey"]!;

            services.AddOpenAIChatCompletion(oaiModelType, oaiApiKey);
        }
        else
        {
            throw new InvalidOperationException("Unsupported AI service type.");
        }

        return services;
    }
}

