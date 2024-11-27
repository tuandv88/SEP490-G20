using Learning.Application.Models.Courses.Commands.UpdateLectureProgress;
using System;

namespace Learning.Tests.Application.UnitTest.Models.Courses.Helpers;

public static class UpdateLectureProgressTestData
{
    public static UpdateLectureProgressCommand GetValidUpdateLectureProgressCommand()
    {
        return new UpdateLectureProgressCommand(
            CourseId: Guid.NewGuid(),
            LectureId: Guid.NewGuid(),
            Duration: 1200 // Duration in seconds (20 minutes)
        );
    }

    public static UpdateLectureProgressCommand GetInvalidUpdateLectureProgressCommand_NonexistentCourse()
    {
        return new UpdateLectureProgressCommand(
            CourseId: Guid.NewGuid(),
            LectureId: Guid.NewGuid(),
            Duration: 1200
        );
    }

    public static UpdateLectureProgressCommand GetInvalidUpdateLectureProgressCommand_NonexistentLecture()
    {
        return new UpdateLectureProgressCommand(
            CourseId: Guid.NewGuid(),
            LectureId: Guid.NewGuid(),
            Duration: 1200
        );
    }
}
