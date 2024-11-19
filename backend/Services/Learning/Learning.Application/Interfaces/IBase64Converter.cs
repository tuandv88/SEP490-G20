namespace Learning.Application.Interfaces;
public interface IBase64Converter {
    MemoryStream ConvertToMemoryStream(string base64String);
}