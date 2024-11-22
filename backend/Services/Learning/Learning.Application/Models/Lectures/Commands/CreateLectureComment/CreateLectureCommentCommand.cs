using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Lectures.Commands.CreateLectureComment;
[Authorize]
public record CreateLectureCommentCommand(Guid CourseId, Guid LectureId, string Comment): ICommand<CreateLectureCommentResult>;
public record CreateLectureCommentResult(Guid Id);

