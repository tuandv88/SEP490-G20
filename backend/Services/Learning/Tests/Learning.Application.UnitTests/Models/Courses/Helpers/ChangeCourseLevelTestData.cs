using Learning.Application.Models.Courses.Commands.ChangeCourseLevel;
using Learning.Application.Models.Courses.Dtos;

namespace Learning.Tests.Application.UnitTest.Models.Courses.Helpers;

public static class ChangeCourseLevelTestData
{
    public static ChangeCourseLevelCommand GetValidChangeCourseLevelCommand()
    {
        return new ChangeCourseLevelCommand(
            CourseId: Guid.NewGuid(),
            CourseLevel: "Advanced"
        );
    }

    public static ChangeCourseLevelCommand GetInvalidChangeCourseLevelCommand_NullCourseLevel()
    {
        return new ChangeCourseLevelCommand(
            CourseId: Guid.NewGuid(),
            CourseLevel: null
        );
    }

    public static ChangeCourseLevelCommand GetInvalidChangeCourseLevelCommand_EmptyCourseLevel()
    {
        return new ChangeCourseLevelCommand(
            CourseId: Guid.NewGuid(),
            CourseLevel: ""
        );
    }

    public static ChangeCourseLevelCommand GetInvalidChangeCourseLevelCommand_InvalidCourseLevel()
    {
        return new ChangeCourseLevelCommand(
            CourseId: Guid.NewGuid(),
            CourseLevel: "InvalidLevel"
        );
    }
}
