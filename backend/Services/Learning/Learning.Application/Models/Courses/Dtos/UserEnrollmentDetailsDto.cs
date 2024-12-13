namespace Learning.Application.Models.Courses.Dtos;
public record UserEnrollmentDetailsDto(
    Guid CourseId,
    string Title,
    string Headline,
    string ImageUrl,
    DateTime EnrollmentDate,
    DateTime? CompletionDate,
    string Status,
    double CompletionPercentage,
    int Rating,
    string Feedback,
    Guid FirstLectureId
);

