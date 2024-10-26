using IdentityServer4.Models;
using IdentityServer4;

namespace AuthServer.Config
{
    public class ClientConfig
    {
        public static IEnumerable<Client> GetClients =>

            new Client[]
            {
                ///////////////////////////////////////////
                // Console Client Credentials Flow Sample
                //////////////////////////////////////////
                new Client
                {
                    ClientId = "client",
                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    ClientSecrets = { new Secret("secret".Sha256()) },
                    AllowedScopes = { "api1", "api2.read_only" },

                    // Thời gian sống cho access token
                    AccessTokenLifetime = 60 * 60, // 1 giờ
                     // Cho phép sử dụng refresh token
                    AllowOfflineAccess = true,
                    AbsoluteRefreshTokenLifetime = 30 * 24 * 60 * 60, // 30 ngày (tính bằng giây)
                    SlidingRefreshTokenLifetime = 15 * 24 * 60 * 60, // 15 ngày (tính bằng giây)
                    RequirePkce = true // Bảo mật PKCE
                },

                 ///////////////////////////////////////////
                // MVC Code Flow Code
                //////////////////////////////////////////
                new Client
                {
                    ClientId = "ICoderVN",
                    AllowedGrantTypes = GrantTypes.Code,    // Tự tìm đến Account/Login của identityServer đẻ Author
                    AllowOfflineAccess = true,
                    RequireClientSecret = false,
                    AllowedCorsOrigins = { "https://localhost:5004" },

                    // đăng nhập thành công thì redirect lại theo đường dẫn này
                    RedirectUris = { "https://localhost:5004/callback.html" },
                    // khi logout nó chạy cổng này và xử lý logout thì nó redirect đến url: 5001 logout của identityServer
                    PostLogoutRedirectUris = { "https://localhost:5004/index.html" },

                    // ở client này cho phép chuy cập đến những cái này
                    AllowedScopes = new List<string>
                    { 
                        // ở đây chúng ta cho chuy cập cả thông tin user lần api
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        IdentityServerConstants.StandardScopes.Email
                    }
                 }

            };
    }
}
