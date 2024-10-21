using System.ComponentModel.DataAnnotations;

namespace AuthServer.Models.AccountViewModel
{
    public class LoginViewModel
    {
        [Display(Name = "User Name Or Email")]
        [Required]
        public string UsernameOrEmail { get; set; }

        [Display(Name = "Password")]
        [Required]
        [DataType(DataType.Password)]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 8)]
        public string Password { get; set; }

        [Display(Name = "Remember Me?")]
        public bool RememberMe { get; set; }
    }
}
