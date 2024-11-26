namespace Learning.Application.Models.Courses.Dtos;
public record CreateCourseDto(
    string Title,
    string Description,
    string Headline,
    string Prerequisites,
    string Objectives,
    string TargetAudiences,
    ImageDto Image,
    string CourseLevel,
    double Price
);

public record ImageDto(
    string FileName,
    string Base64Image,
    string ContentType
);