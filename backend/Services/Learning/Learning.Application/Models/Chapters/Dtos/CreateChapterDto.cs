namespace Learning.Application.Models.Chapters.Dtos;
public record CreateChapterDto(
    string Title,
    string Description,
    bool IsActive = true
);
