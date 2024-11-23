namespace Learning.Application.Models.Lectures.Dtos;
public record LectureCommentDto(
    Guid Id,
    Guid UserId,
    string Comment,
    DateTime? LastModified
);

