using System;
using Learning.Application.Models.Courses.Commands.Deletecourse;

namespace Learning.Tests.Application.UnitTest.Models.Course.Helpers;

public static class DeleteCourseTestData
{
    public static DeleteCourseCommand GetValidDeleteCourseCommand()
    {
        return new DeleteCourseCommand(CourseId: Guid.NewGuid());
    }

    public static DeleteCourseCommand GetInvalidDeleteCourseCommand_EmptyCourseId()
    {
        return new DeleteCourseCommand(CourseId: Guid.Empty); // Invalid CourseId
    }

}
