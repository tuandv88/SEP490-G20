using Learning.Application.Models.Lectures.Dtos;

namespace Learning.Application.Models.Lectures.Queries.GetLectureComment;
public record GetLectureCommentQuery (PaginationRequest PaginationRequest, Guid LectureId): IQuery<GetLectureCommentResult>;
public record GetLectureCommentResult(PaginatedResult<LectureCommentDto> Comments);

