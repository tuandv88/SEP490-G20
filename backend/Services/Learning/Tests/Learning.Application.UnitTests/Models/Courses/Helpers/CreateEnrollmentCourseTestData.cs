using Learning.Application.Models.Courses.Commands.CreateEnrollmentCourse;
using System;

namespace Learning.Tests.Application.UnitTest.Models.Courses.Helpers;

public static class CreateEnrollmentCourseTestData
{
    public static CreateEnrollmentCourseCommand GetValidCreateEnrollmentCourseCommand()
    {
        return new CreateEnrollmentCourseCommand(Guid.NewGuid());
    }

    public static CreateEnrollmentCourseCommand GetInvalidCreateEnrollmentCourseCommand_NonexistentCourse()
    {
        return new CreateEnrollmentCourseCommand(Guid.NewGuid());
    }

    public static CreateEnrollmentCourseCommand GetValidCreateEnrollmentCourseCommand_AlreadyEnrolled()
    {
        return new CreateEnrollmentCourseCommand(Guid.NewGuid());
    }

    public static CreateEnrollmentCourseCommand GetInvalidCreateEnrollmentCourseCommand_PaidCourse()
    {
        return new CreateEnrollmentCourseCommand(Guid.NewGuid());
    }

    public static CreateEnrollmentCourseCommand GetInvalidCreateEnrollmentCourseCommand_UnpublishedCourse()
    {
        return new CreateEnrollmentCourseCommand(Guid.NewGuid());
    }
}
