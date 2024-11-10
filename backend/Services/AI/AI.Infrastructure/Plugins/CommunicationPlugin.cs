using Newtonsoft.Json;
using System.ComponentModel;

namespace AI.Infrastructure.Plugins;
public class CommunicationPlugin(IClientCommunicationService client) {

    [KernelFunction, Description("Retrieve the current code that the user is working on from the client using the connectionId.")]
    public async Task<string> GetUserCodeAsync(string connectionId) {
        var messageCode = await client.RequestUserCodeFromClient(connectionId);
        return JsonConvert.SerializeObject(messageCode);
    }
}
