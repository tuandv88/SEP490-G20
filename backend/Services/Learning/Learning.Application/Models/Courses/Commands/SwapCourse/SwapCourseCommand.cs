namespace Learning.Application.Models.Courses.Commands.SwapCourse;
public record SwapCourseCommand(Guid CourseId1, Guid CourseId2) : ICommand<SwapCourseResult>;
public record SwapCourseResult(int OrderIndexCourse1, int OrderIndexCourse2);

