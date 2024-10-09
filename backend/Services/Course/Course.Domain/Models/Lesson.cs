using System.Reflection.Metadata;

namespace Course.Domain.Models;
public class Lesson : Aggregate<LessonId> {
    public LectureId LectureId { get; set; } = default!; // unique
    private readonly List<Document> _documents = new();
    public IReadOnlyList<Document> Documents => _documents.AsReadOnly();
    private readonly List<Video> _videos = new();
    public IReadOnlyList<Video> Videos => _videos.AsReadOnly();
}

