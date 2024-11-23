using Learning.Application.Models.Lectures.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Lectures.Commands.CreateLectureComment;
[Authorize]
public record CreateLectureCommentCommand(Guid CourseId, Guid LectureId, CreateLectureCommentDto Comment): ICommand<CreateLectureCommentResult>;
public record CreateLectureCommentResult(Guid Id);

