using System.ComponentModel.DataAnnotations;

namespace AuthServer.Models.AccountViewModel
{
    public class ForgotPasswordViewModel
    {

        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }
}
