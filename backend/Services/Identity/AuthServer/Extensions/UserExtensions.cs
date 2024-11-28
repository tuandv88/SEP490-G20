using AuthServer.Dtos.Users;
using AuthServer.Models.ProfileViewModel;
using AuthServer.Models;
using System.Text.Json;
using BuidingBlocks.Storage.Interfaces;
using BuidingBlocks.Storage;
using Microsoft.AspNetCore.Identity;

namespace AuthServer.Extensions
{
    public static class UserExtensions
    {
        public static async Task<List<UserDto>> ToUserDtoListAsync(this List<Users> users, IFilesService filesService, UserManager<Users> userManager)
        {
            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                // Lấy URL ảnh
                var imageUrl = await filesService.GetFileAsync(StorageConstants.BUCKET, user.ProfilePicture, 60);

                // Chuyển đổi User thành UserDto
                userDtos.Add(user.ToUserDto(imageUrl.PresignedUrl!));
            }

            return userDtos;
        }

        public static UserDto ToUserDto(this Users user, string imageUrl)
        {
            // Giá trị mặc định cho Bio và Address
            var bio = new Bio();
            var address = new Address();

            // Xử lý giải tuần tự hóa JSON cho Bio
            if (!string.IsNullOrEmpty(user.Bio))
            {
                try
                {
                    bio = JsonSerializer.Deserialize<Bio>(user.Bio) ?? new Bio();
                }
                catch (JsonException)
                {
                    bio = new Bio(); // Sử dụng giá trị mặc định nếu lỗi
                }
            }

            // Xử lý giải tuần tự hóa JSON cho Address
            if (!string.IsNullOrEmpty(user.Address))
            {
                try
                {
                    address = JsonSerializer.Deserialize<Address>(user.Address) ?? new Address();
                }
                catch (JsonException)
                {
                    address = new Address(); // Sử dụng giá trị mặc định nếu lỗi
                }
            }

            // Trả về UserDto với các giá trị được xử lý
            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DateOfBirth = user.DateOfBirth,
                PhoneNumber = user.PhoneNumber,
                UrlProfilePicture = imageUrl,
                Bio = bio,
                Address = address
            };
        }

        public static async Task<List<UserDetailDto>> ToUserDetailDtoListAsync(this List<Users> users, IFilesService filesService, UserManager<Users> userManager)
        {
            var userDetailDtos = new List<UserDetailDto>();

            foreach (var user in users)
            {
                // Lấy URL ảnh đại diện của người dùng
                var imageUrl = await filesService.GetFileAsync(StorageConstants.BUCKET, user.ProfilePicture, 60);

                // Lấy danh sách các vai trò (roles) của người dùng
                var roles = await userManager.GetRolesAsync(user);

                // Chuyển đổi thông tin người dùng thành UserDetailDto
                userDetailDtos.Add(user.ToUserDetailDto(imageUrl.PresignedUrl!, roles));
            }

            return userDetailDtos;
        }

        public static UserDetailDto ToUserDetailDto(this Users user, string imageUrl, IList<string> roles)
        {
            // Giá trị mặc định cho Bio và Address
            var bio = new Bio();
            var address = new Address();

            // Xử lý giải tuần tự hóa JSON cho Bio
            if (!string.IsNullOrEmpty(user.Bio))
            {
                try
                {
                    bio = JsonSerializer.Deserialize<Bio>(user.Bio) ?? new Bio();
                }
                catch (JsonException)
                {
                    bio = new Bio(); // Sử dụng giá trị mặc định nếu lỗi
                }
            }

            // Xử lý giải tuần tự hóa JSON cho Address
            if (!string.IsNullOrEmpty(user.Address))
            {
                try
                {
                    address = JsonSerializer.Deserialize<Address>(user.Address) ?? new Address();
                }
                catch (JsonException)
                {
                    address = new Address(); // Sử dụng giá trị mặc định nếu lỗi
                }
            }

            // Trả về UserDetailDto với các giá trị được xử lý
            return new UserDetailDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DateOfBirth = user.DateOfBirth,
                PhoneNumber = user.PhoneNumber,
                UrlProfilePicture = imageUrl,
                Bio = bio,
                Address = address,
                Roles = roles.ToList(),
                IsAccountLocked = user.LockoutEnabled && user.LockoutEnd > DateTime.UtcNow,
                TimeLockoutEnd = user.LockoutEnd?.DateTime,
                IsTwoFactorEnabled = user.TwoFactorEnabled
            };
        }
    }
}
