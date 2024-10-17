using Microsoft.AspNetCore.Identity;
using AuthServer.Models;

namespace AuthServer.Data
{
    public static class SeedDataSample
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // Đảm bảo cơ sở dữ liệu được tạo ra
            context.Database.EnsureCreated();

            // Kiểm tra nếu đã có dữ liệu trong bảng Users
            if (context.Users.Any())
            {
                return; // Nếu đã có dữ liệu, không thực hiện seeding
            }

            // Tạo instance của PasswordHasher
            var passwordHasher = new PasswordHasher<Users>();

            // Dữ liệu seeding cho Users
            var users = new List<Users>();
            for (int i = 1; i <= 5; i++) // Chỉ tạo 5 người dùng
            {
                var user = new Users
                {
                    Id = Guid.NewGuid(),
                    FirstName = $"FirstName{i}",
                    LastName = $"LastName{i}",
                    // Chuyển đổi DateOfBirth sang UTC
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
                    AccessFailedCount = 0
                };

                // Hash mật khẩu và gán vào thuộc tính PasswordHash
                user.PasswordHash = passwordHasher.HashPassword(user, "P@ss1234");

                users.Add(user);
            }

            context.Users.AddRange(users);
            context.SaveChanges(); // Lưu vào cơ sở dữ liệu

            // Dữ liệu seeding cho Roles
            var roles = new List<Roles>
    {
        new Roles { Id = Guid.NewGuid(), Name = "Admin", NormalizedName = "ADMIN", ConcurrencyStamp = Guid.NewGuid().ToString() },
        new Roles { Id = Guid.NewGuid(), Name = "User", NormalizedName = "USER", ConcurrencyStamp = Guid.NewGuid().ToString() }
    };
            context.Roles.AddRange(roles);
            context.SaveChanges();

            // Seeding UserRoles
            var userRoles = new List<UserRoles>();
            foreach (var user in users)
            {
                userRoles.Add(new UserRoles
                {
                    UserId = user.Id,
                    RoleId = roles[1].Id // Gán tất cả người dùng vào vai trò User
                });
            }
            context.UserRoles.AddRange(userRoles);
            context.SaveChanges();

            // Seeding UserClaims
            for (int i = 1; i <= 5; i++) // Seeding cho 5 người dùng
            {
                context.UserClaims.Add(new UserClaims
                {
                    UserId = users[i - 1].Id,
                    ClaimType = "claim_type",
                    ClaimValue = $"claim_value_{i}"
                });
            }
            context.SaveChanges();

            // Nếu cần seeding UserTokens và UserLogins, giữ lại, nếu không thì bỏ đi
            for (int i = 1; i <= 5; i++) // Seeding cho 5 người dùng
            {
                context.UserTokens.Add(new UserTokens
                {
                    UserId = users[i - 1].Id,
                    LoginProvider = "Default",
                    Name = $"TokenName{i}",
                    Value = $"TokenValue{i}"
                });

                context.UserLogins.Add(new UserLogins
                {
                    UserId = users[i - 1].Id,
                    LoginProvider = "Google",
                    ProviderKey = $"GoogleId{i}",
                    ProviderDisplayName = "Google"
                });
            }
            context.SaveChanges();
        }

    }
}