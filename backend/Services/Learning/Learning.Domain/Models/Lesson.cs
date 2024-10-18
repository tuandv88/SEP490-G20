using Learning.Domain.Model;

namespace Learning.Domain.Models;
public class Lesson : Aggregate<LessonId> {
    private readonly List<Document> _documents = new();
    public IReadOnlyList<Document> Documents => _documents.AsReadOnly();
    public Video Video { get; private set; } = default!;
}

