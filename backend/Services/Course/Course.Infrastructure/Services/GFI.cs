using Course.Application.Common;
using System.IO.Compression;

namespace Course.Infrastructure.Services;
public class GFI : IGFI {
    public string CompressFolderToBase64(string folderPath) {
        string zipFilePath = ZipFolder(folderPath);
        byte[] zipBytes = File.ReadAllBytes(zipFilePath);
        return Convert.ToBase64String(zipBytes);
    }

    private string ZipFolder(string folderPath) {
        string zipPath = $"{folderPath}.zip";
        if (File.Exists(zipPath)) {
            File.Delete(zipPath);
        }
        ZipFile.CreateFromDirectory(folderPath, zipPath);
        return zipPath;
    }
}

