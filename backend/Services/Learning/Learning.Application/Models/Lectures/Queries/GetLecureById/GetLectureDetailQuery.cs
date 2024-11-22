using Learning.Application.Models.Lectures.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Lectures.Queries.GetLecureById;
[Authorize]
public record GetLectureDetailQuery(Guid LectureId) : IQuery<GetLectureDetailsResult>;
public record GetLectureDetailsResult(LectureDetailsDto LectureDetailsDto);

