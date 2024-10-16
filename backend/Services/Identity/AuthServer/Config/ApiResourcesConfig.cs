using IdentityServer4.Models;

namespace AuthServer.Config
{
    public class ApiResourcesConfig
    {
        // danh sách các Api
        public static IEnumerable<ApiResource> GetApiResources =>
            new ApiResource[]
            {
                new ApiResource("api.WebApp", "WebApp API")
            };
    }
}
