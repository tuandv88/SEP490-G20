using Learning.Application.Interfaces;

namespace Learning.Infrastructure.Services;
public class Base64Converter : IBase64Converter {
    public MemoryStream ConvertToMemoryStream(string base64String) {
        var base64Data = base64String.Contains(",") ? base64String.Split(',')[1] : base64String;
        byte[] imageBytes = Convert.FromBase64String(base64Data);
        return new MemoryStream(imageBytes);
    }
}



