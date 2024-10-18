namespace AuthServer.Models.AccountViewModel
{
    public class TwoFactorAuthenticationViewModel
    {
        public string Code { get; set; }
        public string? Token { get; set; }
        public string? QRCodeUrl { get; set; }
    }
}
