namespace Learning.Application.Models.Chapters.Commands.DeleteChapter;
public record DeleteChapterCommand(Guid CourseId, Guid ChapterId) : ICommand;

