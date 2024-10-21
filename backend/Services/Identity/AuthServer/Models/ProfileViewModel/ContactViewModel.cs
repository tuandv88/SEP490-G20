using System.ComponentModel.DataAnnotations;

namespace AuthServer.Models.ProfileViewModel
{
    public class ContactViewModel
    {
        [Required(ErrorMessage = "Fullname is required.")]
        public string RealName { get; set; }

        [Required(ErrorMessage = "Phone number is required.")]
        [Phone(ErrorMessage = "Invalid phone number.")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Address is required.")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Please select a university.")]
        public string University { get; set; }
    }
}
