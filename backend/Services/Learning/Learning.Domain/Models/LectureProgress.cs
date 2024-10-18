namespace Learning.Domain.Models;
public class LectureProgress : Entity<LectureProgressId>{
    public UserCourseId UserCourseId { get; set; } = default!;
    public LectureId LectureId { get; set; } = default!;
    public DateTime? CompletionDate { get; set; }
    public bool IsCurrent { get; set; } = false;
    public string Notes { get; set; } = default!;
    public long Duration { get; set; } = default!;
}

