using Learning.Application.Models.Lectures.Dtos;

namespace Learning.Application.Models.Lectures.Queries.GetLecureById;
public record GetLectureByIdDetailQuery(Guid ChapterId, Guid LectureId) : IQuery<GetLectureByIdDetailResult>;
public record GetLectureByIdDetailResult(LectureDetailsDto LectureDetailsDto);

