using AI.Domain.Abstractions;
using AI.Domain.ValueObjects;

namespace AI.Domain.Models;
public class Document : Entity<DocumentId> {
    public Dictionary<string, object> Tags { get; set; } = default!;
    public string FileName { get; set; } = default!;
    public string MimeType { get; set; } = default!;
    public long FileSize { get; set; }
    public string Index { get; set; } = default!;
    public List<Message>? Messages { get; set; } = default!;

    public static Document Create(DocumentId Id, string fileName, string mimeType, long fileSize , Dictionary<string, object> tags, string index) {
        var document = new Document() {
            Id = Id,
            Tags = tags,
            FileName = fileName,
            MimeType = mimeType,
            FileSize = fileSize,
            Index = index
        };
        //TODO event
        return document;
    }
}

