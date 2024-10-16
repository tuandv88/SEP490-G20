using System.ComponentModel.DataAnnotations;

namespace AuthServer.Models.AccountViewModel
{
    public class VerifyAuthenicatorViewModel
    {
        [Required]
        public string Code { get; set; }
        public string? ReturnUrl { get; set; }
        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }
}
