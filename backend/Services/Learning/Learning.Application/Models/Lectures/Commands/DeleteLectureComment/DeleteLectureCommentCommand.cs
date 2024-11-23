using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Lectures.Commands.DeleteLectureComment;

[Authorize]
public record DeleteLectureCommentCommand(Guid CourseId, Guid LectureId, Guid LectureCommentId): ICommand;
