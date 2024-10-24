using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

public static class RsaKeyHelper
{
    // Hàm này sẽ tạo hoặc tải RSA Key từ một file đã tồn tại. Nếu file không tồn tại, nó sẽ tạo khóa RSA mới và lưu vào file.
    public static RsaSecurityKey GenerateOrLoadRsaKey(string keyFilePath)
    {
        // Kiểm tra nếu file khóa đã tồn tại
        if (File.Exists(keyFilePath))
        {
            // Tạo một đối tượng RSA mới
            var rsa = RSA.Create();

            // Tải khóa private RSA từ file và nhập nó vào đối tượng RSA
            rsa.ImportRSAPrivateKey(File.ReadAllBytes(keyFilePath), out _);

            // Trả về khóa RSA dưới dạng RsaSecurityKey để sử dụng cho việc ký token
            return new RsaSecurityKey(rsa);
        }
        else
        {
            // Nếu file không tồn tại, tạo khóa RSA mới
            var rsa = RSA.Create();

            // Đặt kích thước cho khóa RSA là 2048-bit (mức bảo mật tốt)
            rsa.KeySize = 2048;

            // Xuất khóa private RSA dưới dạng byte để có thể lưu trữ
            var privateKeyBytes = rsa.ExportRSAPrivateKey();

            // Lưu khóa private RSA vào file tại đường dẫn chỉ định
            File.WriteAllBytes(keyFilePath, privateKeyBytes);

            // Trả về khóa RSA dưới dạng RsaSecurityKey để sử dụng cho việc ký token
            return new RsaSecurityKey(rsa);
        }
    }
}
