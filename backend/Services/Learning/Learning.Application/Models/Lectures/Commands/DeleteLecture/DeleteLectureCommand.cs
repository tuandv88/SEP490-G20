using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Lectures.Commands.DeleteLecture;

[Authorize(Roles = $"{RoleType.Administrator}")]
public record DeleteLectureCommand(Guid ChapterId, Guid LectureId): ICommand;
