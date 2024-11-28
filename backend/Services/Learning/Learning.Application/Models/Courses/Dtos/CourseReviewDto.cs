namespace Learning.Application.Models.Courses.Dtos;
public record CourseReviewDto(
    Guid SubmittedBy,
    string Feedback,
    int Rating,
    DateTime DateSubmitted
);

