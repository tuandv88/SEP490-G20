using Learning.Application.Models.Chapters.Dtos;

namespace Learning.Application.Models.Chapters.Queries.GetChapterById;
public record GetChapterByIdQuery(Guid CourseId, Guid ChapterId): IQuery<GetChapterByIdResult>;
public record GetChapterByIdResult(ChapterDto ChapterDto);

