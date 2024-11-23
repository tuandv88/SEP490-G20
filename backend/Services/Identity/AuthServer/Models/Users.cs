using Microsoft.AspNetCore.Identity;

namespace AuthServer.Models
{
    public class Users : IdentityUser<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string ProfilePicture { get; set; }
        // Json
        public string Bio { get; set; } 
        // Json
        public string Address { get; set; }


    }
}
