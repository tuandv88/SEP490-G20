using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Files.Queries.GetFileById;

public record GetFileByIdQuery(Guid LectureId, Guid FileId) : IQuery<GetFileByIdResult>;
public record GetFileByIdResult(string PresignedUrl);

