using AuthServer.Models;
using IdentityModel;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace AuthServer.Repository.Services.Profile
{
    public class CustomProfileService : IProfileService
    {
        private readonly UserManager<Users> _userManager;

        public CustomProfileService(UserManager<Users> userManager)
        {
            _userManager = userManager;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            // Lấy thông tin người dùng từ UserManager
            var user = await _userManager.GetUserAsync(context.Subject);

            // Lấy roles của người dùng từ UserManager
            var roles = await _userManager.GetRolesAsync(user);

            // Lấy email của người dùng
            var email = await _userManager.GetEmailAsync(user);

            // Thêm roles vào claims
            var roleClaims = roles.Select(role => new Claim(JwtClaimTypes.Role, role));
            context.IssuedClaims.AddRange(roleClaims);

            // Thêm email vào claims nếu không null
            if (!string.IsNullOrEmpty(email))
            {
                context.IssuedClaims.Add(new Claim(JwtClaimTypes.Email, email));
            }
        }

        public Task IsActiveAsync(IsActiveContext context)
        {
            return Task.CompletedTask;
        }
    }
}
