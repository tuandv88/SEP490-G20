namespace Learning.Domain.Models;
public class LectureProgress : Entity<LectureProgressId>{
    public UserCourseId UserCourseId { get; set; } = default!;
    public LectureId LectureId { get; set; } = default!;
    public DateTime? CompletionDate { get; set; }
    public bool IsCurrent { get; set; } = false;
    public long Duration { get; set; } = default!;

    public static LectureProgress Create(LectureProgressId Id, UserCourseId userCourseId, LectureId lectureId, DateTime? completionDate, bool isCurrent, long duration ) {
        return new LectureProgress() {
            Id = Id,
            UserCourseId = userCourseId,
            LectureId = lectureId,
            CompletionDate = completionDate,
            IsCurrent = isCurrent,
            Duration = duration
        };
    }
}

