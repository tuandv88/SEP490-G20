using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Chapters.Commands.SwapChapter;

[Authorize(Roles = $"{RoleType.Administrator}")]
public record SwapChapterCommand(Guid ChapterId1, Guid ChapterId2) : ICommand<SwapChapterResult>;
public record SwapChapterResult(int OrderIndexChapter1, int OrderIndexChapter2);

