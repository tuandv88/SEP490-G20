using AuthServer.Models;
using BuidingBlocks.Storage;
using BuidingBlocks.Storage.Interfaces;
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
        private readonly IFilesService _filesService;

        public CustomProfileService(UserManager<Users> userManager, IFilesService filesService)
        {
            _userManager = userManager;
            _filesService = filesService;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            // Lấy thông tin người dùng từ UserManager
            var user = await _userManager.GetUserAsync(context.Subject);

            // Lấy roles của người dùng
            var roles = await _userManager.GetRolesAsync(user);

            // Lấy email, userId, username, FirstName và LastName
            var email = await _userManager.GetEmailAsync(user);
            var userId = user.Id;
            var username = user.UserName;
            var firstName = user.FirstName;
            var lastName = user.LastName;

            // Thêm roles vào claims
            var roleClaims = roles.Select(role => new Claim(JwtClaimTypes.Role, role));
            context.IssuedClaims.AddRange(roleClaims);

            // Thêm email vào claims nếu có
            if (!string.IsNullOrEmpty(email))
            {
                context.IssuedClaims.Add(new Claim("email", email));  // Sử dụng "email" thay vì JwtClaimTypes.Email
            }

            // Thêm userId vào claims
            context.IssuedClaims.Add(new Claim(JwtClaimTypes.Subject, user.Id.ToString()));  // Sử dụng JwtClaimTypes.Subject

            // Thêm username vào claims
            context.IssuedClaims.Add(new Claim("username", username));  // Sử dụng "username" thay vì JwtClaimTypes.PreferredUserName

            // Thêm FirstName vào claims nếu có
            if (!string.IsNullOrEmpty(firstName))
            {
                context.IssuedClaims.Add(new Claim("firstName", firstName));  // Sử dụng "firstName" thay vì JwtClaimTypes.GivenName
            }

            // Thêm LastName vào claims nếu có
            if (!string.IsNullOrEmpty(lastName))
            {
                context.IssuedClaims.Add(new Claim("lastName", lastName));  // Sử dụng "lastName" thay vì JwtClaimTypes.FamilyName
            }

            var s3Object = await _filesService.GetFileAsync(StorageConstants.BUCKET, user.ProfilePicture, 60);

            if (s3Object != null) 
            {
                context.IssuedClaims.Add(new Claim("urlImagePresigned", s3Object.PresignedUrl!));
            }
        }

        public Task IsActiveAsync(IsActiveContext context)
        {
            return Task.CompletedTask;
        }
    }
}
