using Newtonsoft.Json;
using System.ComponentModel;

namespace AI.Infrastructure.Plugins;
public class CommunicationPlugin(IClientCommunicationService client) {

    [KernelFunction, Description("Retrieve the current code snippet the user is working on from the client based on the provided connectionId.")]
    public async Task<string> FetchCurrentUserCodeAsync(string connectionId) {
        var userCode = await client.RequestUserCodeFromClient(connectionId);
        return JsonConvert.SerializeObject(userCode);
    }
}
