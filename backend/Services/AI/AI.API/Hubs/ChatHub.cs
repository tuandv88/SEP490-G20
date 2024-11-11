using AI.API.Hubs.Requests;
using AI.API.Hubs.Responses;
using AI.Application.Models.Messages.Commands;
using AI.Application.Models.Messages.Dtos;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace AI.API.Hubs;
public class ChatHub(ISender sender, ILogger<ChatHub> logger) : Hub<IChatClient> {
    public async override Task OnConnectedAsync() {
        string? userId = Context.UserIdentifier;
        if (userId != null) {
            logger.LogInformation("User {UserId} connected with ConnectionId {ConnectionId}", userId, Context.ConnectionId);
        } else {
            logger.LogInformation("Anonymous client connected with ConnectionId {ConnectionId}", Context.ConnectionId);
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception) {
        string? userId = Context.UserIdentifier;
        if (userId != null) {
            if (exception != null) {
                logger.LogInformation("User {UserId} disconnected with error: {ErrorMessage}", userId, exception.Message);
            } else {
                logger.LogInformation("User {UserId} disconnected without error.", userId);
            }
        } else {
            if (exception != null) {
                logger.LogInformation("Anonymous client disconnected with error: {ErrorMessage}", exception.Message);
            } else {
                logger.LogInformation("Anonymous client disconnected without error.");
            }
        }
        await base.OnDisconnectedAsync(exception);
    }

    public async Task<MessageSentResponse> SendMessage(MessageSentRequest request) {
        var command = new MessageSentCommand(Context.ConnectionId, request.Message);
        var result = await sender.Send(command);
        return result.Adapt<MessageSentResponse>();
    }

    //public async Task DeliverMessage(string userId, MessageDto message) {
    //    await Clients.User(userId).ReceiveMessage(message);
    //}
}