using AuthServer.Models.ProfileViewModel;

namespace AuthServer.Dtos.Users
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public List<string> Roles { get; set; }              // Danh sách vai trò của người dùng
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string PhoneNumber { get; set; }
        public string UrlProfilePicture { get; set; }        // imageAvatarUrl
        public Address Address { get; set; }                 // Đối tượng Address(Json) : Province / District / School
        public Bio Bio { get; set; }                         // Đối tượng Bio(Json) :  Facebook / LinkIn / Twitter
    }
}
