using IdentityServer4.Models;

namespace AuthServer.Config
{
    public class ApiScopesConfig
    {
        public static IEnumerable<ApiScope> GetApiScopes =>
        new List<ApiScope>
        {
                new ApiScope("api.WebApp", "WebApp API"),
                new ApiScope("moviesApi", "Access to Movies API")
        };
    }
}
