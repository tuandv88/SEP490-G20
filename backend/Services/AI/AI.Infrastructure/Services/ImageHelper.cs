namespace AI.Infrastructure.Services;

public static class ImageHelper {
    public static async Task<string> ConvertImageUrlToBase64Async(string imageUrl) {
        using var httpClient = new HttpClient();
        var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
        return Convert.ToBase64String(imageBytes);
    }
    public static string GetMimeTypeFromUrl(string url) {
        var extension = Path.GetExtension(url).ToLowerInvariant();
        return extension switch {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".bmp" => "image/bmp",
            ".webp" => "image/webp",
            ".tiff" => "image/tiff",
            _ => "application/octet-stream"
        };
    }
}


