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
                     ClientId = "movies_client",
                     ClientSecrets = { new Secret("secret".Sha256()) },  // Secret được mã hóa theo Sha256
                     AllowedGrantTypes = GrantTypes.Code,                // Authorization Code Flow
                     RequireConsent = false,                             // Không yêu cầu người dùng xác nhận lại
                     RequirePkce = true,                                 // Yêu cầu PKCE để tăng cường bảo mật
                     AllowedCorsOrigins = { "https://localhost:5003" },  // Cho phép nguồn gốc từ máy khách

                     RedirectUris = { "https://localhost:5003/callback.html" },         // URL callback sau khi đăng nhập
                     PostLogoutRedirectUris = { "https://localhost:5003/index.html" },  // URL sau khi đăng xuất

                     AllowedScopes = new List<string>
                        {
                        "offline_access",                               // (refresh token) 
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        IdentityServerConstants.StandardScopes.Email,
                        "moviesApi",
                        "roles"  // Thêm scope roles để yêu cầu cấp phát claim role

                        },
                     // Bật tính năng cấp refresh token - Cho phép offline access (refresh token) - Mặc định Flow Code 
                    AllowOfflineAccess = true,
                     // Tùy chọn khác để refresh token
                    RefreshTokenUsage = TokenUsage.ReUse,  // Sử dụng lại refresh token hoặc thay thế mỗi lần dùng
                    RefreshTokenExpiration = TokenExpiration.Sliding,  // Hết hạn dựa trên sự hoạt động của người dùng
                    
                    //RedirectUris = { "https://localhost:5003/signin-oidc" },
                    //PostLogoutRedirectUris = { "https://localhost:5003/signout-callback-oidc" },
                 }
            };
    }
}
