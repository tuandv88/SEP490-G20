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
        public string Password { get; set; }

        [Display(Name = "Remember Me?")]
        public bool RememberMe { get; set; }
    }
}
