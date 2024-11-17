namespace Learning.Application.Models.Chapters.Commands.SwapChapter;
public record SwapChapterCommand(Guid ChapterId1, Guid ChapterId2) : ICommand<SwapChapterResult>;
public record SwapChapterResult(int OrderIndexChapter1, int OrderIndexChapter2);

