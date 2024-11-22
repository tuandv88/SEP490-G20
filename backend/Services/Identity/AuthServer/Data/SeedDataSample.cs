using Microsoft.AspNetCore.Identity;
using IdentityServer4.Models;
using AuthServer.Models;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using AuthServer.Config;

namespace AuthServer.Data
{
    public static class SeedDataSample
    {
        public static void Initialize(ApplicationDbContext appDbContext, ConfigurationDbContext configDbContext, PersistedGrantDbContext persistedGrantDbContext, IConfiguration configuration)
        {
            // Đảm bảo tất cả cơ sở dữ liệu đã được tạo ra
            appDbContext.Database.EnsureCreated();
            configDbContext.Database.EnsureCreated();
            persistedGrantDbContext.Database.EnsureCreated();

            // Gọi các phương thức seeding cho từng loại dữ liệu
            SeedUsersAndRoles(appDbContext);
            SeedClients(configDbContext, configuration);  // Truyền configuration vào để lấy Clients từ appsettings.json
            SeedIdentityResources(configDbContext);
            SeedApiScopes(configDbContext);
            SeedApiResources(configDbContext);
        }

        // Seed Users and Roles
        private static void SeedUsersAndRoles(ApplicationDbContext appDbContext)
        {
            if (appDbContext.Users.Any()) return; // Không seed nếu đã có người dùng

            var passwordHasher = new PasswordHasher<Users>();

            // Seed Users
            var users = new List<Users>();
            for (int i = 1; i <= 6; i++) // Chỉ tạo 6 người dùng
            {
                var user = new Users
                {
                    Id = Guid.NewGuid(),
                    FirstName = $"FirstName{i}",
                    LastName = $"LastName{i}",
                    DateOfBirth = DateTime.Now.AddYears(-20).AddDays(-i).ToUniversalTime(),
                    ProfilePicture = $"profile{i}.jpg",
                    Bio = "{}",
                    Address = "{}",
                    UserName = $"username{i}",
                    NormalizedUserName = $"USERNAME{i}".ToUpper(),
                    Email = $"user{i}@example.com",
                    NormalizedEmail = $"USER{i}@EXAMPLE.COM".ToUpper(),
                    EmailConfirmed = true,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    ConcurrencyStamp = Guid.NewGuid().ToString(),
                    PhoneNumber = $"123456789{i}",
                    PhoneNumberConfirmed = false,
                    TwoFactorEnabled = false,
                    LockoutEnd = null,
                    LockoutEnabled = true,
                    AccessFailedCount = 0,
                    PasswordHash = passwordHasher.HashPassword(null, "P@ss1234")
                };

                users.Add(user);
            }

            appDbContext.Users.AddRange(users);
            appDbContext.SaveChanges();

            // Seed Roles
            var roles = new List<Roles>
            {
                 new Roles { Id = Guid.NewGuid(), Name = "admin", NormalizedName = "ADMIN", ConcurrencyStamp = Guid.NewGuid().ToString() },
                 new Roles { Id = Guid.NewGuid(), Name = "moderator", NormalizedName = "MODERATOR", ConcurrencyStamp = Guid.NewGuid().ToString() },
                 new Roles { Id = Guid.NewGuid(), Name = "learner", NormalizedName = "LEARNER", ConcurrencyStamp = Guid.NewGuid().ToString() }
            };
            appDbContext.Roles.AddRange(roles);
            appDbContext.SaveChanges();

            // Giả sử bạn đã có danh sách người dùng từ trước
            var userList = appDbContext.Users.ToList();

            // Seed UserRoles
            var userRoles = new List<UserRoles>();

            // Vòng lặp để gán vai trò cho người dùng
            for (int i = 0; i < userList.Count; i++)
            {
                if (i == 0)
                {
                    userRoles.Add(new UserRoles
                    {
                        UserId = users[i].Id,
                        RoleId = roles[0].Id // Vai trò Admin
                    });
                }
                else if(i == 1 || i == 2)
                {
                    userRoles.Add(new UserRoles
                    {
                        UserId = users[i].Id,
                        RoleId = roles[1].Id 
                    });
                }
                else
                {
                    userRoles.Add(new UserRoles
                    {
                        UserId = users[i].Id,
                        RoleId = roles[2].Id 
                    });
                }
            }

            appDbContext.UserRoles.AddRange(userRoles);
            appDbContext.SaveChanges();

            // Seed UserClaims, UserTokens, UserLogins
            SeedUserClaimsTokensLogins(appDbContext, users);
        }

        // Seed UserClaims, UserTokens, UserLogins
        private static void SeedUserClaimsTokensLogins(ApplicationDbContext appDbContext, List<Users> users)
        {
            // Seeding UserClaims
            for (int i = 1; i <= 6; i++)
            {
                appDbContext.UserClaims.Add(new UserClaims
                {
                    UserId = users[i - 1].Id,
                    ClaimType = "claim_type",
                    ClaimValue = $"claim_value_{i}"
                });
            }
            appDbContext.SaveChanges();

            // Seeding UserTokens và UserLogins
            for (int i = 1; i <= 6; i++)
            {
                appDbContext.UserTokens.Add(new UserTokens
                {
                    UserId = users[i - 1].Id,
                    LoginProvider = "Default",
                    Name = $"TokenName{i}",
                    Value = $"TokenValue{i}"
                });

                appDbContext.UserLogins.Add(new UserLogins
                {
                    UserId = users[i - 1].Id,
                    LoginProvider = "Google",
                    ProviderKey = $"GoogleId{i}",
                    ProviderDisplayName = "Google"
                });
            }
            appDbContext.SaveChanges();
        }

        // Seed Clients
        private static void SeedClients(ConfigurationDbContext configDbContext, IConfiguration configuration)
        {
            if (!configDbContext.Clients.Any())
            {
                var clients = ClientConfig.GetClients(configuration); // Lấy danh sách Clients từ ClientConfig
                foreach (var client in clients)
                {
                    configDbContext.Clients.Add(client.ToEntity());
                }
                configDbContext.SaveChanges();
            }
        }

        // Seed Identity Resources
        private static void SeedIdentityResources(ConfigurationDbContext configDbContext)
        {
            if (!configDbContext.IdentityResources.Any())
            {
                var identityResources = IdentityResourcesConfig.GetIdentityResources; // Lấy danh sách IdentityResources từ IdentityResourcesConfig
                foreach (var resource in identityResources)
                {
                    configDbContext.IdentityResources.Add(resource.ToEntity());
                }
                configDbContext.SaveChanges();
            }
        }

        // Seed Api Scopes
        private static void SeedApiScopes(ConfigurationDbContext configDbContext)
        {
            if (!configDbContext.ApiScopes.Any())
            {
                var apiScopes = ApiScopesConfig.GetApiScopes; // Lấy danh sách ApiScopes từ ApiScopesConfig
                foreach (var scope in apiScopes)
                {
                    configDbContext.ApiScopes.Add(scope.ToEntity());
                }
                configDbContext.SaveChanges();
            }
        }

        // Seed Api Resources
        private static void SeedApiResources(ConfigurationDbContext configDbContext)
        {
            if (!configDbContext.ApiResources.Any())
            {
                var apiResources = ApiResourcesConfig.GetApiResources; // Lấy danh sách ApiResources từ ApiResourcesConfig
                foreach (var resource in apiResources)
                {
                    configDbContext.ApiResources.Add(resource.ToEntity());
                }
                configDbContext.SaveChanges();
            }
        }
    }
}
