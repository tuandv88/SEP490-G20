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
                // Lấy vai trò của từng người dùng
                var roles = await userManager.GetRolesAsync(user);

                // Lấy URL ảnh
                var imageUrl = await filesService.GetFileAsync(StorageConstants.BUCKET, user.ProfilePicture, 60);

                // Chuyển đổi User thành UserDto
                userDtos.Add(user.ToUserDto(imageUrl.PresignedUrl!, roles.ToList()));
            }

            return userDtos;
        }

        public static UserDto ToUserDto(this Users user, string imageUrl, List<string> roles)
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
                Roles = roles, // Gắn danh sách vai trò vào UserDto
                Bio = bio,
                Address = address
            };
        }
    }
}
