namespace Learning.Domain.Models;
public class UserCourse : Aggregate<UserCourseId>{
    public UserId UserId { get; set; } = default!;
    private readonly List<LectureProgress> _lectureProgress = new();
    public IReadOnlyList<LectureProgress> LectureProgress => _lectureProgress.AsReadOnly();
    public CourseId CourseId { get; set; } = default!;
    public DateTime EnrollmentDate {  get; set; }
    public DateTime? CompletionDate { get; set; }
    public UserCourseStatus UserCourseStatus { get; set; } = UserCourseStatus.InProgress;
    public int Rating { get; set; } = -1;
    public string Feedback { get; set; } = default!;

}

