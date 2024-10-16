namespace AuthServer.Models.AccountViewModel
{
    public class TwoFaceLoginViewModel
    {
        public string Email { get; set; }
        public string Code { get; set; }
        public DateTime TokenExpiry { get; set; } // Thêm thời gian hết hạn của token
    }
}
