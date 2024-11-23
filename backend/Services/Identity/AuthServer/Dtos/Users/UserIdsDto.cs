using System.ComponentModel.DataAnnotations;

namespace AuthServer.Dtos.Users
{
    public class UserIdsDto
    {
        [Required(ErrorMessage = "The UserIds list cannot be empty.")]
        [MinLength(1, ErrorMessage = "There must be at least one UserId.")]
        public List<Guid> UserIds { get; set; } = new List<Guid>();
    }
}
