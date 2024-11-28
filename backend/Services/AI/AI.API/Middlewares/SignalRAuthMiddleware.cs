namespace AI.API.Middlewares;
public class SignalRAuthMiddleware {
    private readonly RequestDelegate _next;

    public SignalRAuthMiddleware(RequestDelegate next) {
        _next = next;
    }

    public async Task Invoke(HttpContext context) {
        if (context.Request.Query.TryGetValue("access_token", out var token)) {
            if (!context.Request.Headers.ContainsKey("Authorization")) {
                context.Request.Headers.Append("Authorization", $"Bearer {token}");
            }
        }
        await _next(context);
    }
}

