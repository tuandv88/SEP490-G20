using Learning.Domain.Events;

namespace Learning.Domain.Models;
public class UserEnrollment : Aggregate<UserEnrollmentId> {
    public UserId UserId { get; set; } = default!;
    public List<LectureProgress> LectureProgress = new();
    public CourseId CourseId { get; set; } = default!;
    public DateTime EnrollmentDate { get; set; }
    public DateTime? CompletionDate { get; set; }
    public UserEnrollmentStatus UserEnrollmentStatus { get; set; } = UserEnrollmentStatus.InProgress;
    public int Rating { get; set; } = -1;
    public string Feedback { get; set; } = default!;

    public static UserEnrollment Create(UserEnrollmentId Id, UserId userId, CourseId courseId, DateTime enrollmentDate) {
        return new UserEnrollment() {
            Id = Id,
            UserId = userId,
            CourseId = courseId,
            EnrollmentDate = enrollmentDate,
            Feedback = ""
        };
    }
    public void AddProgress(LectureProgress progress) {
        LectureProgress.Add(progress);
        progress.AddDomainEvent(new LectureCompletedEvent(progress));
        // thêm event vào đây
    }
    public void AddReview(int rating, string feedback) {
        Rating = rating;
        Feedback = feedback;
    }
    public void UpdateStatus(UserEnrollmentStatus status) {
        UserEnrollmentStatus = status;
    }
}

