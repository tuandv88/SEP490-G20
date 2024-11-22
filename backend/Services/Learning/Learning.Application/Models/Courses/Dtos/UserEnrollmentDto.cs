namespace Learning.Application.Models.Courses.Dtos;
public record UserEnrollmentDto(
    DateTime EnrollmentDate,
    DateTime? CompletionDate,
    string Status,
    int Rating,
    string Feedback
);
