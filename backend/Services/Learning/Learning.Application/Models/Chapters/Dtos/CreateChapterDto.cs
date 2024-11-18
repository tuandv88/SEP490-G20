namespace Learning.Application.Models.Chapters.Dtos;
public record CreateChapterDto(
    string Title,
    string Description,
    double TimeEstimation,
    bool IsActive = true
);
