using Learning.Application.Models.Chapters.Dtos;

namespace Learning.Application.Models.Courses.Dtos;
public record CoursePreviewDto(
    Guid Id,
    string Title,
    string Description,
    string Headline,
    double TimeEstimation,
    string Prerequisites,
    string Objectives,
    string TargetAudiences,
    string ImageUrl,
    string CourseLevel,
    double Price,
    List<ChapterPreviewDto> Chapters,
    DateTime LastModified
);


