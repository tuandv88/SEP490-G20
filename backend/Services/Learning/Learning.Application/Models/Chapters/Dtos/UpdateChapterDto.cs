namespace Learning.Application.Models.Chapters.Dtos;
public record UpdateChapterDto(
    string Title,
    string Description,
    double TimeEstimation,
    bool IsActive = true
);

