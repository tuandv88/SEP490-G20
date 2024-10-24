using IdentityServer4.Models;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

public static class ClientConfig
{
    // Phương thức tĩnh để lấy danh sách các Client từ cấu hình
    public static IEnumerable<Client> GetClients(IConfiguration configuration)
    {
        var clientsSection = configuration.GetSection("IdentityServer:Clients");
        var clients = new List<Client>();

        foreach (var clientConfig in clientsSection.GetChildren())
        {
            var client = new Client
            {
                ClientId = clientConfig["ClientId"],

                // Đọc AllowedGrantTypes từ cấu hình
                AllowedGrantTypes = ParseGrantTypes(clientConfig.GetSection("AllowedGrantTypes").Get<List<string>>()),

                RequirePkce = bool.Parse(clientConfig["RequirePkce"]),
                RequireClientSecret = bool.Parse(clientConfig["RequireClientSecret"]),
                RequireConsent = bool.Parse(clientConfig["RequireConsent"]),
                AllowedCorsOrigins = clientConfig.GetSection("AllowedCorsOrigins").Get<List<string>>(),
                RedirectUris = clientConfig.GetSection("RedirectUris").Get<List<string>>(),
                PostLogoutRedirectUris = clientConfig.GetSection("PostLogoutRedirectUris").Get<List<string>>(),
                AllowedScopes = clientConfig.GetSection("AllowedScopes").Get<List<string>>(),
                AccessTokenLifetime = int.Parse(clientConfig["AccessTokenLifetime"]),
                AllowOfflineAccess = bool.Parse(clientConfig["AllowOfflineAccess"]),
                AbsoluteRefreshTokenLifetime = int.Parse(clientConfig["AbsoluteRefreshTokenLifetime"]),

                // Đọc RefreshTokenExpiration từ cấu hình
                RefreshTokenExpiration = clientConfig["RefreshTokenExpiration"] == "Sliding"
                    ? TokenExpiration.Sliding : TokenExpiration.Absolute,

                SlidingRefreshTokenLifetime = int.Parse(clientConfig["SlidingRefreshTokenLifetime"]),

                // Đọc RefreshTokenUsage từ cấu hình
                RefreshTokenUsage = clientConfig["RefreshTokenUsage"] == "ReUse"
                    ? TokenUsage.ReUse : TokenUsage.OneTimeOnly
            };

            clients.Add(client);
        }

        return clients;
    }

    // Hàm hỗ trợ để parse AllowedGrantTypes từ cấu hình
    private static ICollection<string> ParseGrantTypes(List<string> grantTypes)
    {
        var result = new List<string>();

        foreach (var grantType in grantTypes)
        {
            if (grantType.Equals("Code", StringComparison.OrdinalIgnoreCase))
            {
                result.Add(GrantType.AuthorizationCode);
            }

            // Có thể thêm nhiều loại GrantType khác tại đây
            //else if (grantType.Equals("Implicit", StringComparison.OrdinalIgnoreCase))
            //{
            //    result.Add(GrantType.Implicit);
            //}
        }

        return result;
    }
}
