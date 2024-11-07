using AI.Domain.Abstractions;
using AI.Domain.ValueObjects;

namespace AI.Domain.Models;
public class Document : Entity<DocumentId> {
    public Dictionary<string, object> Tags { get; set; } = default!;
    public string FileName { get; set; } = default!;
    public string MimeType { get; set; } = default!;
    public long FileSize { get; set; }
    public List<Message>? Messages { get; set; } = default!;
}

