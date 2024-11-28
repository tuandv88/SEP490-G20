using AuthServer.Models.ProfileViewModel;

namespace AuthServer.Dtos.Users
{
    public class UserDetailDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string PhoneNumber { get; set; }
        public string UrlProfilePicture { get; set; }        // imageAvatarUrl
        public Address Address { get; set; }                 // Đối tượng Address(Json) : Province / District / School
        public Bio Bio { get; set; }                         // Đối tượng Bio(Json) :  Facebook / LinkIn / Twitter

        // Danh sách các vai trò (roles) của người dùng
        public List<string> Roles { get; set; }

        // Trạng thái khóa tài khoản và thời gian khóa (UTC)
        public bool IsAccountLocked { get; set; }
        public DateTime? TimeLockoutEnd { get; set; }

        // Trạng thái xác thực hai yếu tố
        public bool IsTwoFactorEnabled { get; set; }
    }
}
