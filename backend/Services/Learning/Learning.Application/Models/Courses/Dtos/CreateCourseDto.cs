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
    string ImageUrl,
    int OrderIndex,
    string CourseLevel,
    double Price
);
