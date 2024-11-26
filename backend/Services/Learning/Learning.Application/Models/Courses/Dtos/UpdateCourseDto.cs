namespace Learning.Application.Models.Courses.Dtos;
public record UpdateCourseDto(
    string Title,
    string Description,
    string Headline,
    string Prerequisites,
    string Objectives,
    string TargetAudiences,
    double Price
);


