using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

using System.IO;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

public static class RsaKeyHelper
{
    public static RsaSecurityKey GenerateOrLoadRsaKey(string filePath)
    {
        // Kiểm tra xem file khóa RSA đã tồn tại chưa
        if (File.Exists(filePath))
        {
            // Tải khóa RSA từ tệp (định dạng PEM)
            var rsa = RSA.Create();
            var keyContent = File.ReadAllText(filePath);
            rsa.ImportFromPem(keyContent.ToCharArray());
            return new RsaSecurityKey(rsa);
        }
        else
        {
            // Tạo mới RSA Key
            var rsa = RSA.Create(2048); // Tạo khóa RSA với độ dài 2048 bit

            // Lưu khóa RSA mới dưới định dạng PEM
            var privateKeyPem = ExportPrivateKeyToPem(rsa);
            Directory.CreateDirectory(Path.GetDirectoryName(filePath)); // Đảm bảo thư mục tồn tại
            File.WriteAllText(filePath, privateKeyPem);

            return new RsaSecurityKey(rsa);
        }
    }

    // Hàm để xuất Private Key ra định dạng PEM
    private static string ExportPrivateKeyToPem(RSA rsa)
    {
        var privateKeyBytes = rsa.ExportRSAPrivateKey();
        return PemFormat(privateKeyBytes, "RSA PRIVATE KEY");
    }

    // Hàm để định dạng dữ liệu thành PEM
    private static string PemFormat(byte[] data, string pemType)
    {
        var base64 = Convert.ToBase64String(data);
        var pemBuilder = new System.Text.StringBuilder();
        pemBuilder.AppendLine($"-----BEGIN {pemType}-----");

        // Chia thành các dòng 64 ký tự
        for (int i = 0; i < base64.Length; i += 64)
        {
            pemBuilder.AppendLine(base64.Substring(i, Math.Min(64, base64.Length - i)));
        }

        pemBuilder.AppendLine($"-----END {pemType}-----");
        return pemBuilder.ToString();
    }
}

