using Learning.Application.Models.Lectures.Dtos;

namespace Learning.Application.Models.Chapters.Dtos;
public record ChapterPreviewDto(
    Guid Id,
    string Title,
    int OrderIndex,
    List<LecturePreviewDto> Lectures
);

