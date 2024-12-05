namespace Learning.Domain.Models;
public class LectureProgress : Aggregate<LectureProgressId>{
    public UserEnrollmentId UserEnrollmentId { get; set; } = default!;
    public LectureId LectureId { get; set; } = default!;
    public DateTime? CompletionDate { get; set; }
    public bool IsCurrent { get; set; } = false;
    public long Duration { get; set; } = default!;

    public static LectureProgress Create(LectureProgressId Id, UserEnrollmentId userCourseId, LectureId lectureId, DateTime? completionDate, bool isCurrent, long duration ) {
        return new LectureProgress() {
            Id = Id,
            UserEnrollmentId = userCourseId,
            LectureId = lectureId,
            CompletionDate = completionDate,
            IsCurrent = isCurrent,
            Duration = duration
        };
    }
}

