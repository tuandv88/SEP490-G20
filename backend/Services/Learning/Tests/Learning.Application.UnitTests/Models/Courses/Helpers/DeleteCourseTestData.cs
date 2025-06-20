﻿using System;
using Learning.Application.Models.Courses.Commands.DeleteCourse;

namespace Learning.Tests.Application.UnitTest.Models.Courses.Helpers;

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
