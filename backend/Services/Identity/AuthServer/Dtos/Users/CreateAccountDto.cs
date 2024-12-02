namespace AuthServer.Dtos.Users
{
    public class CreateAccountDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Role { get; set; } // Role nếu cần
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool ConfirmEmail { get; set; }
    }
}
