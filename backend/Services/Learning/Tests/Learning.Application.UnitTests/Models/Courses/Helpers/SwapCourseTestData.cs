using Learning.Application.Models.Courses.Commands.SwapCourse;

namespace Learning.Tests.Application.UnitTest.Models.Course.Helpers;

public static class SwapCourseTestData
{
    public static SwapCourseCommand GetValidSwapCourseCommand()
    {
        return new SwapCourseCommand(
            CourseId1: Guid.NewGuid(),
            CourseId2: Guid.NewGuid()
        );
    }

    public static SwapCourseCommand GetInvalidSwapCourseCommand_NonexistentCourse1()
    {
        return new SwapCourseCommand(
            CourseId1: Guid.NewGuid(),
            CourseId2: Guid.NewGuid()
        );
    }

    public static SwapCourseCommand GetInvalidSwapCourseCommand_NonexistentCourse2()
    {
        return new SwapCourseCommand(
            CourseId1: Guid.NewGuid(),
            CourseId2: Guid.NewGuid()
        );
    }
}
