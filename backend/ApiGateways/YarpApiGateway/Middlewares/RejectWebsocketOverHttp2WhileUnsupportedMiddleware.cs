using Microsoft.AspNetCore.Http.Features;
 
namespace YarpApiGateway.Middlewares;
public class RejectWebsocketOverHttp2WhileUnsupportedMiddleware {
    private readonly RequestDelegate _next;
    private readonly ILogger<RejectWebsocketOverHttp2WhileUnsupportedMiddleware> _logger;

    public RejectWebsocketOverHttp2WhileUnsupportedMiddleware(RequestDelegate next, ILogger<RejectWebsocketOverHttp2WhileUnsupportedMiddleware> logger) {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context) {
        _logger.LogInformation("Protocol used for connection: {Protocol}", context.Request.Protocol);

        if (context.Request.Method == HttpMethods.Connect && context.Request.Protocol != HttpProtocol.Http11) {
            var resetFeature = context.Features.Get<IHttpResetFeature>();
            if (resetFeature != null) {
                //https://www.rfc-editor.org/rfc/rfc7540#page-51
                //HTTP_1_1_REQUIRED (0xd):  The endpoint requires that HTTP/1.1 be used instead of HTTP/2.
                resetFeature.Reset(errorCode: 0xd);
                return;
            }
        }

        await _next.Invoke(context);
    }
}

public static class RejectWebsocketOverHttp2WhileUnsupportedMiddlewareExtensions {
    public static IApplicationBuilder UseRejectWebsocketOverHttp2WhileUnsupported(this IApplicationBuilder builder) {
        return builder.UseMiddleware<RejectWebsocketOverHttp2WhileUnsupportedMiddleware>();
    }
}
