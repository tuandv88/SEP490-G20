using IdentityServer4.Models;

namespace AuthServer.Config
{
    public class ApiResourcesConfig
    {
        // danh sách các Api
        public static IEnumerable<ApiResource> GetApiResources =>
            new List<ApiResource>
            {
                new ApiResource("api.WebApp", "WebApp API"),
                // Định nghĩa API cho Movies API
                new ApiResource("moviesApi", "Access to Movies API")
                {
                    Scopes = { "moviesApi" }  // Đặt scope cho API Movies
                }

            };
    }
}
