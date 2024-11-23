namespace Learning.Domain.Models;
public class LectureComment : Entity<LectureCommentId> {
    public UserId UserId { get; set; } = default!;
    public LectureId LectureId { get; set; } = default!;
    public string Content { get; set; } = default!;
    public static LectureComment Create(LectureCommentId id, UserId userId, LectureId lectureId, string content) {
        return new LectureComment {
            Id = id,
            UserId = userId,
            LectureId = lectureId,
            Content = content
        };
    }
}

