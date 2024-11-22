using Learning.Application.Models.Chapters.Dtos;

namespace Learning.Application.Models.Courses.Dtos;
public record CoursePreviewDto(
    Guid Id,
    string Title,
    string Description,
    string Headline,
    string CourseStatus,
    double TimeEstimation,
    string Prerequisites,
    string Objectives,
    string TargetAudiences,
    DateTime? ScheduledPublishDate,
    string ImageUrl,
    int OrderIndex,
    string CourseLevel,
    double Price,
    List<ChapterPreviewDto> Chapters
);


