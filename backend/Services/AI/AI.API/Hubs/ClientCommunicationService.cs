using AI.Application.Interfaces;
using AI.Application.Models.Messages.Dtos;
using Microsoft.AspNetCore.SignalR;

namespace AI.API.Hubs;
public class ClientCommunicationService(IHubContext<ChatHub, IChatClient> hubContext) : IClientCommunicationService {
    public async Task<MessageCodeDto> RequestUserCodeFromClient(string connectionId) {
        return await hubContext.Clients.Client(connectionId).RequestUserCode();
    }
}

