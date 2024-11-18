namespace Learning.Application.Models.Courses.Commands.ChangeCourseLevel;
public record ChangeCourseLevelCommand(Guid CourseId, string CourseLevel) : ICommand<ChangeCourseLevelResult>;
public record ChangeCourseLevelResult(bool IsSuccess, string Message);

