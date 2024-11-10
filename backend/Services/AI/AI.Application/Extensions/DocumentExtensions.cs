using AI.Application.Models.Documents.Dtos;

namespace AI.Application.Extensions;
public static class DocumentExtensions {

    public static DocumentDto ToDocumentDto(this Document document, string url) {
        return new DocumentDto(
            Id: document.Id.Value,
            Tags: document.Tags,
            FileName: document.FileName,
            MimeType: document.MimeType,
            FileSize: document.FileSize,
            Index: document.Index,
            Url: url
            );
    }
}

