using System.ComponentModel.DataAnnotations;

namespace AuthServer.Models.AccountViewModel
{
    public class VerifyAuthenicatorViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "User Or Email")]
        public string UserOrEmail { get; set; }

        [Required]
        public string Code { get; set; }
        public string? ReturnUrl { get; set; }
        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }
}
