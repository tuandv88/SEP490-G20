using Learning.Application.Models.Lectures.Dtos;

namespace Learning.Application.Models.Chapters.Dtos;
public record ChapterDetailDto(
    ChapterDto ChapterDto,
    List<LectureDto> LectureDtos
);

