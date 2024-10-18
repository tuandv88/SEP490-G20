namespace Learning.Domain.Models;
public class LectureComment : Entity<LectureCommentId> {
    public UserId UserId { get; set; } = default!;
    public LectureId LectureId { get; set; } = default!;
    public string Content { get; set; } = default!;
}

