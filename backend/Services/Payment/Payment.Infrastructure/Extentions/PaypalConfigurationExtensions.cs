using Elastic.CommonSchema;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Payment.Infrastructure.Extentions;
public static class PaypalConfigurationExtensions {
    public static void AddPaypal(this IServiceCollection services, IConfiguration configuration) {
        services.AddSingleton(sp => {
            var environment = configuration["PayPal:Environment"]!;
            var clientId = configuration["PayPal:ClientId"];
            var clientSecret = configuration["PayPal:ClientSecret"];
            if (environment.Equals("Sandbox")) {
                return new PayPalCheckoutSdk.Core.PayPalHttpClient(
               new PayPalCheckoutSdk.Core.SandboxEnvironment(clientId, clientSecret));
            } else {
                return new PayPalCheckoutSdk.Core.PayPalHttpClient(
              new PayPalCheckoutSdk.Core.LiveEnvironment(clientId, clientSecret));
            }
        });
    }
}

