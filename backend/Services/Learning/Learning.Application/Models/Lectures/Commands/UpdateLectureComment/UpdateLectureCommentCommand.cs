using Learning.Application.Models.Lectures.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Lectures.Commands.UpdateLectureComment;

[Authorize]
public record UpdateLectureCommentCommand(Guid CourseId, Guid LectureId, Guid LectureCommentId, UpdateLectureCommentDto Comment): ICommand<UpdateLectureCommentResult>;
public record UpdateLectureCommentResult(bool IsSuccess);
