namespace Learning.Domain.Models;
public class UserCourse : Aggregate<UserCourseId> {
    public UserId UserId { get; set; } = default!;
    public List<LectureProgress> LectureProgress = new();
    public CourseId CourseId { get; set; } = default!;
    public DateTime EnrollmentDate { get; set; }
    public DateTime? CompletionDate { get; set; }
    public UserCourseStatus UserCourseStatus { get; set; } = UserCourseStatus.InProgress;
    public int Rating { get; set; } = -1;
    public string Feedback { get; set; } = default!;

    public static UserCourse Create(UserCourseId Id, UserId userId, CourseId courseId, DateTime enrollmentDate) {
        return new UserCourse() {
            Id = Id,
            UserId = userId,
            CourseId = courseId,
            EnrollmentDate = enrollmentDate,
            Feedback = ""
        };
    }
    public void AddProgress(LectureProgress progress) {
        LectureProgress.Add(progress);
        // thêm event vào đây
    }
}

