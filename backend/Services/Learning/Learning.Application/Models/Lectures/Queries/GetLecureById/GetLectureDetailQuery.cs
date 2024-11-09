using Learning.Application.Models.Lectures.Dtos;

namespace Learning.Application.Models.Lectures.Queries.GetLecureById;
public record GetLectureDetailQuery(Guid LectureId) : IQuery<GetLectureDetailsResult>;
public record GetLectureDetailsResult(LectureDetailsDto LectureDetailsDto);

