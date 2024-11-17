namespace Learning.Application.Models.Courses.Dtos;
public record UpdateCourseDto(
    string Title,
    string Description,
    string Headline,
    string CourseStatus,
    double TimeEstimation,
    string Prerequisites,
    string Objectives,
    string TargetAudiences,
    string ScheduledPublishDate,
    int OrderIndex,
    string CourseLevel,
    double Price
);


