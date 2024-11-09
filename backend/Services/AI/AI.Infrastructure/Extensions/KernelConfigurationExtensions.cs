using AI.Infrastructure.Plugins;
using AI.Infrastructure.Services.Kernels;
using AI.Infrastructure.Services.Kernels.Prompts;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.KernelMemory;
using Microsoft.KernelMemory.DocumentStorage;
using Microsoft.KernelMemory.Prompts;
using static Microsoft.KernelMemory.AWSS3Config;

namespace AI.Infrastructure.Extensions;
public static class KernelConfigurationExtensions
{

    public static IServiceCollection AddKernelConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        string apiKey = configuration["AzureOpenAI:ApiKey"]!;

        string deploymentChatName = configuration["AzureOpenAI:DeploymentChatName"]!;
        int maxTokenTotalChat = configuration.GetValue<int>("AzureOpenAI:MaxTokenTotalChat");

        string deploymentEmbeddingName = configuration["AzureOpenAI:DeploymentEmbeddingName"]!;
        int maxTokenTotalEmbedding = configuration.GetValue<int>("AzureOpenAI:MaxTokenTotalEmbedding");
        int embeddingDimensions = configuration.GetValue<int>("AzureOpenAI:EmbeddingDimensions");

        string endpoint = configuration["AzureOpenAI:Endpoint"]!;

        string qdrantApiKey = configuration["Qdrant:ApiKey"]!;
        string qdrantEndpoint = configuration["Qdrant:Endpoint"]!;

        string awsS3AccessKey = configuration["AWS:AccessKey"]!;
        string awsS3SecretKey = configuration["AWS:SecretKey"]!;
        string awsS3Endpoint = configuration["AWS:Url"]!;
        string awsS3Bucket = configuration["AWS:Bucket"]!;

        int searchClientMaxMatchesCount = configuration.GetValue<int>("SearchClient:MaxMatchesCount");
        int searchClientAnswerTokens = configuration.GetValue<int>("SearchClient:AnswerTokens");

        var embeddingConfig = new AzureOpenAIConfig
        {
            APIKey = apiKey,
            Deployment = deploymentEmbeddingName,
            Endpoint = endpoint,
            APIType = AzureOpenAIConfig.APITypes.EmbeddingGeneration,
            Auth = AzureOpenAIConfig.AuthTypes.APIKey,
            MaxTokenTotal = maxTokenTotalEmbedding,
            EmbeddingDimensions = embeddingDimensions
        };

        var chatConfig = new AzureOpenAIConfig
        {
            APIKey = apiKey,
            Deployment = deploymentChatName,
            Endpoint = endpoint,
            APIType = AzureOpenAIConfig.APITypes.ChatCompletion,
            Auth = AzureOpenAIConfig.AuthTypes.APIKey,
            MaxTokenTotal = maxTokenTotalChat,
        };

        var awsS3Config = new AWSS3Config()
        {
            AccessKey = awsS3AccessKey,
            SecretAccessKey = awsS3SecretKey,
            Endpoint = awsS3Endpoint,
            BucketName = awsS3Bucket,
            Auth = AuthTypes.AccessKey,
        };

        services.AddSingleton(awsS3Config);

        var qdrantConfig = new QdrantConfig()
        {
            APIKey = qdrantApiKey,
            Endpoint = qdrantEndpoint
        };

        var searchClientConfig = new SearchClientConfig() {
            MaxMatchesCount = searchClientMaxMatchesCount,
            AnswerTokens = searchClientAnswerTokens,
            FactTemplate = "==== [File:{{$source}};DocumentId:{{$documentId}};Relevance:{{$relevance}}]:\n{{$content}}"
        };

        services.AddSingleton(searchClientConfig);

        var kernelMemory = new KernelMemoryBuilder()
            .WithAzureOpenAITextGeneration(chatConfig)
            .WithAzureOpenAITextEmbeddingGeneration(embeddingConfig)
            .WithQdrantMemoryDb(qdrantConfig)
            .WithAWSS3DocumentStorageCustom(awsS3Config)
            .WithCustomSearchClient<SearchClientService>()
            .WithSearchClientConfig(searchClientConfig) 
            .WithCustomPromptProvider<PromptProvider>()
            .Build();
        
        services.AddSingleton<IPromptProvider, PromptProvider>();

        var kernel = Kernel.CreateBuilder()
            .AddAzureOpenAIChatCompletion(deploymentChatName, endpoint, apiKey)
            .Build();

        //var plugin = new MemoryPlugin(kernelMemory, waitForIngestionToComplete: true);
        //kernel.ImportPluginFromObject(plugin, "memory");
        
        services.AddKernelSingleton(kernel);
        services.AddSingleton(kernelMemory);
        return services;
    }

    public static IKernelMemoryBuilder WithAWSS3DocumentStorageCustom(this IKernelMemoryBuilder builder, AWSS3Config config)
    {
        builder.Services.AddAWSS3AsDocumentStorageCustom(config);
        return builder;
    }
    public static IServiceCollection AddAWSS3AsDocumentStorageCustom(this IServiceCollection services, AWSS3Config config)
    {
        return services
            .AddSingleton(config)
            .AddSingleton<IDocumentStorage, AWSS3StorageService>();
    }

    public static void AddKernelSingleton(this IServiceCollection services, Kernel kernel) {
        services.AddSingleton(provider =>
        {
            using (var scope = provider.CreateScope()) {
                var scopedProvider = scope.ServiceProvider;
                var clientService = scopedProvider.GetRequiredService<IClientCommunicationService>();

                var communicationPlugin = new CommunicationPlugin(clientService);
                var learningPlugin = new LearningPlugin();
                kernel.ImportPluginFromObject(communicationPlugin);
                kernel.ImportPluginFromObject(learningPlugin);
            }

            return kernel;
        });
    }
}
