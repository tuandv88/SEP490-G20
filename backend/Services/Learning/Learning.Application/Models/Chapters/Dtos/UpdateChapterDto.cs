namespace Learning.Application.Models.Chapters.Dtos;
public record UpdateChapterDto(
    string Title,
    string Description,
    double TimeEstimation,
    int OrderIndex,
    bool IsActive = true
);

