namespace AI.Application.Models.Documents.Dtos;
public record DocumentDto(
    Guid Id,
    Dictionary<string, object> Tags,
    string FileName,
    string MimeType,
    long FileSize, //đơn vị byte
    string Index,
    string Url
);

