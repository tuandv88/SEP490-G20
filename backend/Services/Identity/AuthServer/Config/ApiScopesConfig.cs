using IdentityServer4.Models;

namespace AuthServer.Config
{
    public class ApiScopesConfig
    {
        public static IEnumerable<ApiScope> GetApiScopes =>
        new ApiScope[]
        {
                new ApiScope("api.WebApp", "WebApp API")
        };
    }
}
