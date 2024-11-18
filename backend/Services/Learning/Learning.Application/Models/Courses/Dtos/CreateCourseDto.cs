namespace Learning.Application.Models.Courses.Dtos;
public record CreateCourseDto(
    string Title,
    string Description,
    string Headline,
    double TimeEstimation,
    string Prerequisites,
    string Objectives,
    string TargetAudiences,
    string ScheduledPublishDate,
    ImageDto Image,
    string CourseLevel,
    double Price
);

public record ImageDto(
    string FileName,
    string Base64Image,
    string ContentType
);