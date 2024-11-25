using Learning.Application.Models.Courses.Commands.ChangeCourseStatus;
using System;

namespace Learning.Tests.Application.UnitTest.Models.Course.Helpers;

public static class ChangeCourseStatusTestData
{
    public static ChangeCourseStatusCommand GetValidChangeCourseStatusCommand_Published()
    {
        return new ChangeCourseStatusCommand(
            CourseId: Guid.NewGuid(),
            CourseStatus: "Published",
            ScheduledPublishDate: null
        );
    }

    public static ChangeCourseStatusCommand GetValidChangeCourseStatusCommand_Scheduled()
    {
        return new ChangeCourseStatusCommand(
            CourseId: Guid.NewGuid(),
            CourseStatus: "Scheduled",
            ScheduledPublishDate: DateTime.Now.AddDays(5)
        );
    }

    public static ChangeCourseStatusCommand GetInvalidChangeCourseStatusCommand_NullStatus()
    {
        return new ChangeCourseStatusCommand(
            CourseId: Guid.NewGuid(),
            CourseStatus: null,
            ScheduledPublishDate: null
        );
    }

    public static ChangeCourseStatusCommand GetInvalidChangeCourseStatusCommand_EmptyStatus()
    {
        return new ChangeCourseStatusCommand(
            CourseId: Guid.NewGuid(),
            CourseStatus: "",
            ScheduledPublishDate: null
        );
    }

    public static ChangeCourseStatusCommand GetInvalidChangeCourseStatusCommand_InvalidStatus()
    {
        return new ChangeCourseStatusCommand(
            CourseId: Guid.NewGuid(),
            CourseStatus: "InvalidStatus",
            ScheduledPublishDate: null
        );
    }

    public static ChangeCourseStatusCommand GetInvalidChangeCourseStatusCommand_InvalidDate()
    {
        return new ChangeCourseStatusCommand(
            CourseId: Guid.NewGuid(),
            CourseStatus: "Scheduled",
            ScheduledPublishDate: DateTime.Now.AddDays(-1)
        );
    }
}
