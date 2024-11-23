using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;

namespace AuthServer.Models.ProfileViewModel
{
    public class ContactViewModel
    {
        [Required(ErrorMessage = "Phone number is required.")]
        [Phone(ErrorMessage = "Invalid phone number.")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Province is required.")]
        public string Province { get; set; }

        [Required(ErrorMessage = "District is required.")]
        public string District { get; set; }

        [Required(ErrorMessage = "School is required.")]
        public string School { get; set; }

        // Bio không bắt buộc
        public string? Facebook { get; set; }
        public string? LinkedIn { get; set; }
        public string? Twitter { get; set; }
    }

    public class Address
    {
        public string Province { get; set; } = default!;
        public string District { get; set; } = default!;
        public string School { get; set; } = default!;
    }

    public class Bio
    {
        public string Facebook { get; set; } = default!;
        public string LinkedIn { get; set; } = default!;
        public string Twitter { get; set; } = default!;
    }
}
