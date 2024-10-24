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
            var user = await _userManager.GetUserAsync(context.Subject);

            // Lấy roles của người dùng từ UserManager
            var roles = await _userManager.GetRolesAsync(user);

            // Thêm roles vào claims
            var roleClaims = roles.Select(role => new Claim(JwtClaimTypes.Role, role));
            context.IssuedClaims.AddRange(roleClaims);
        }

        public Task IsActiveAsync(IsActiveContext context)
        {
            return Task.CompletedTask;
        }
    }

}
