using System.ComponentModel.DataAnnotations;

namespace AuthServer.Models.ProfileViewModel
{
    public class PersonalViewModel
    {
        [Required]
        public string UserName { get; set; }

        [Required(ErrorMessage = "First Name is required.")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required.")]
        public string LastName { get; set; }

        [DataType(DataType.Date)]
        [Required(ErrorMessage = "Date of Birth is required.")]
        public DateTime Dob { get; set; }
    }

}
