namespace AuthServer.Repository.Services.Base64Converter;

public interface IBase64Converter
{
    MemoryStream ConvertToMemoryStream(string base64String);
}
