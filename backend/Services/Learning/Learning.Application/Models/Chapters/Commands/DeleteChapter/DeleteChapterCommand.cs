using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Chapters.Commands.DeleteChapter;

[Authorize($"{PoliciesType.Administrator}")]
public record DeleteChapterCommand(Guid CourseId, Guid ChapterId) : ICommand;

