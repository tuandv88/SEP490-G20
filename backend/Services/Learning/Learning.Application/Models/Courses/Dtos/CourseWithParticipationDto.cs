namespace Learning.Application.Models.Courses.Dtos;

public record CourseWithParticipationDto(
    Guid CourseId,
    string Title,
    string Headline,
    string ImageUrl,
    DateTime? EnrollmentDate,
    DateTime? CompletionDate,
    string Status,
    double CompletionPercentage,
    double Price,
    double TimeEstimation,
    string CourseLevel
    );