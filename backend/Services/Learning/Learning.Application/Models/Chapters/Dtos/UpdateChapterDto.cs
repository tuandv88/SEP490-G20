namespace Learning.Application.Models.Chapters.Dtos;
public record UpdateChapterDto(
    string Title,
    string Description,
    bool IsActive = true
);

