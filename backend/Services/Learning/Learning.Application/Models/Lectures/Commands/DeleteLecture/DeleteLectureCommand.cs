namespace Learning.Application.Models.Lectures.Commands.DeleteLecture;
public record DeleteLectureCommand(Guid ChapterId, Guid LectureId): ICommand;
