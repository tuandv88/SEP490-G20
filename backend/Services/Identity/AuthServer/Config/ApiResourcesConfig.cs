using IdentityServer4.Models;

namespace AuthServer.Config
{
    public class ApiResourcesConfig
    {
        // danh sách các Api
        public static IEnumerable<ApiResource> GetApiResources =>
            new List<ApiResource>
            {
                // Định nghĩa API cho Movies API
                new ApiResource("testApi", "Access to Test API")
                {
                    Scopes = { "testApi" }  // Đặt scope cho API Movies
                }

            };
    }
}
