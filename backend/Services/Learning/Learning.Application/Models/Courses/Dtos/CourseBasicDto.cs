namespace Learning.Application.Models.Courses.Dtos;

public record CourseBasicDto(
    Guid Id,
    string Title,
    string Headline,
    string CourseStatus,
    DateTime? ScheduledPublishDate,
    string ImageUrl,
    int OrderIndex,
    string CourseLevel,
    double Price,
    double AverageRating,
    int TotalParticipants
    );