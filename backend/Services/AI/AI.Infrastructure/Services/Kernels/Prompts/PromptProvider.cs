using Microsoft.KernelMemory;
using Microsoft.KernelMemory.Prompts;
using System.Reflection;


namespace AI.Infrastructure.Services.Kernels.Prompts;
public class PromptProvider : IPromptProvider
{
    private static readonly string? s_namespace = typeof(PromptProvider).Namespace;

    public string ReadPrompt(string promptName)
    {
        return ReadFile(promptName);
    }

    private static string ReadFile(string promptName)
    {
        var fileName = $"{promptName}.txt";

        // Get the current assembly. Note: this class is in the same assembly where the embedded resources are stored.
        Assembly? assembly = typeof(PromptProvider).GetTypeInfo().Assembly;
        if (assembly == null) { throw new ConfigurationException($"[{s_namespace}] Assembly not found, unable to load '{fileName}' resource"); }

        // Resources are mapped like types, using the namespace and appending "." (dot) and the file name
        var resourceName = $"{s_namespace}." + fileName;
        using Stream? resource = assembly.GetManifestResourceStream(resourceName);
        if (resource == null) { throw new ConfigurationException($"{resourceName} resource not found"); }

        // Return the resource content, in text format.
        using var reader = new StreamReader(resource);
        return reader.ReadToEnd();
    }
}

