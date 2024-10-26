namespace Learning.Application.Models.Courses.Dtos;
public record CreateCourseDto(
    string Title,
    string Description,
    string Headline,
    string CourseStatus,
    double TimeEstimation,
    string Prerequisites,
    string Objectives,
    string TargetAudiences,
    string ScheduledPublishDate,
    ImageDto Image,
    int OrderIndex,
    string CourseLevel,
    double Price
);

public record ImageDto(
    string FileName,
    string Base64Image,
    string ContentType
);