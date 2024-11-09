using System.ComponentModel.DataAnnotations;

namespace AuthServer.Models.ProfileViewModel
{
    public class EmailViewModel
    {
        [Display(Name = "Email Change")]
        [Required]
        public string NewEmail { get; set; }

        public string CurrentEmail { get; set; }
        public bool IsVerified { get; set; }
    }

}
