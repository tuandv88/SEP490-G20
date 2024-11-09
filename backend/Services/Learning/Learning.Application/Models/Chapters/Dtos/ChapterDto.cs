namespace Learning.Application.Models.Chapters.Dtos;
public record ChapterDto(
    Guid Id,
    string Title,
    string Description,
    double TimeEstimation,
    int OrderIndex,
    bool IsActive
);

