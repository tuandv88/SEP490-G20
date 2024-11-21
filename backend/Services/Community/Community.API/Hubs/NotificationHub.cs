using Microsoft.AspNetCore.SignalR;

namespace Community.API.Hubs;

public class NotificationHub : Hub<INotificationClient>
{
    private readonly ILogger<NotificationHub> _logger;

    public NotificationHub(ILogger<NotificationHub> logger)
    {
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        string? userId = Context.UserIdentifier;
        if (userId != null)
        {
            _logger.LogInformation("User {UserId} connected with ConnectionId {ConnectionId}", userId, Context.ConnectionId);
        }
        else
        {
            _logger.LogInformation("Anonymous client connected with ConnectionId {ConnectionId}", Context.ConnectionId);
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        string? userId = Context.UserIdentifier;
        if (userId != null)
        {
            _logger.LogInformation("User {UserId} disconnected. Reason: {Message}", userId, exception?.Message ?? "None");
        }
        await base.OnDisconnectedAsync(exception);
    }
}
