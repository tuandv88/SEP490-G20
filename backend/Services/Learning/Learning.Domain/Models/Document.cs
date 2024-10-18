namespace Learning.Domain.Model;
public class Document : FileEntity<DocumentId>{
    public LessonId LessonId { get; set; } = default!;
}

