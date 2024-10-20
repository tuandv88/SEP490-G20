using Learning.Application.Models.Chapters.Dtos;

namespace Learning.Application.Models.Courses.Dtos;
public record CourseDetailsDto(
    CourseDto CourseDto,
    List<ChapterDetailDto> ChapterDetailsDtos
);


