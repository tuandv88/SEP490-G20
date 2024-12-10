using System.Drawing;

namespace Learning.Application.IntegrationTests.Utils;
public class ImageUtils {
    public static string CreateWhiteImageBase64() {
        // Tạo ảnh trắng 1x1 pixel
        using (var bitmap = new Bitmap(1, 1)) {
            using (var graphics = Graphics.FromImage(bitmap)) {
                graphics.Clear(Color.White);
            }

            using (var ms = new MemoryStream()) {
                // Lưu ảnh vào bộ nhớ dưới dạng PNG
                bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                byte[] imageBytes = ms.ToArray();

                // Chuyển byte[] thành Base64
                return Convert.ToBase64String(imageBytes);
            }
        }
    }
}

