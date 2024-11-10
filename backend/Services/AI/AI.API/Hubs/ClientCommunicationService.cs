using AI.API.Commons;
using AI.Application.Interfaces;
using AI.Application.Models.Messages.Dtos;
using Microsoft.AspNetCore.SignalR;

namespace AI.API.Hubs;
public class ClientCommunicationService(IHubContext<ChatHub> hubContext) : IClientCommunicationService {
    public async Task<MessageCodeDto> RequestUserCodeFromClient(string connectionId) {
        var message = await hubContext.Clients.Client(connectionId).InvokeAsync<MessageCodeDto>(
           SignalRFunctionConstant.Invoke.RequestUserCode, new CancellationToken());
        return message;
    }
}

