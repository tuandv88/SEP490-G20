using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Chapters.Commands.DeleteChapter;

[Authorize(Roles = $"{RoleType.Administrator}")]
public record DeleteChapterCommand(Guid CourseId, Guid ChapterId) : ICommand;

