namespace Learning.Application.Models.Courses.Dtos;
public record CourseProgressDto(
    Guid LectureId,
    DateTime? CompletionDate,
    bool IsCurrent,
    long Duration
);

