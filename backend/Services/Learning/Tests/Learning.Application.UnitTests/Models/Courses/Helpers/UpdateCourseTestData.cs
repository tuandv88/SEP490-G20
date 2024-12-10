using Learning.Application.Models.Courses.Commands.UpdateCourse;
using Learning.Application.Models.Courses.Dtos;

namespace Learning.Tests.Application.UnitTest.Models.Courses.Helpers;
public static class UpdateCourseTestData
{
    public static UpdateCourseCommand GetValidUpdateCourseCommand()
    {
        return new UpdateCourseCommand(
            CourseId: Guid.NewGuid(),
            UpdateCourseDto: new UpdateCourseDto(
                Title: "Updated Title",
                Description: "Updated Description",
                Headline: "Updated Headline",
                Prerequisites: "Updated Prerequisites",
                Objectives: "Updated Objectives",
                TargetAudiences: "Updated Target Audiences",
                Price: 200
            )
        );
    }

    public static UpdateCourseCommand GetInvalidUpdateCourseCommand_NullTitle()
    {
        return new UpdateCourseCommand(
            CourseId: Guid.NewGuid(),
            UpdateCourseDto: new UpdateCourseDto(
                Title: null, // Invalid Title
                Description: "Valid Description",
                Headline: "Valid Headline",
                Prerequisites: "Valid Prerequisites",
                Objectives: "Valid Objectives",
                TargetAudiences: "Valid Target Audiences",
                Price: 100
            )
        );
    }

    public static UpdateCourseCommand GetInvalidUpdateCourseCommand_EmptyDescription()
    {
        return new UpdateCourseCommand(
            CourseId: Guid.NewGuid(),
            UpdateCourseDto: new UpdateCourseDto(
                Title: "Valid Title",
                Description: "", // Invalid Description
                Headline: "Valid Headline",
                Prerequisites: "Valid Prerequisites",
                Objectives: "Valid Objectives",
                TargetAudiences: "Valid Target Audiences",
                Price: 100
            )
        );
    }

    public static UpdateCourseCommand GetInvalidUpdateCourseCommand_NegativePrice()
    {
        return new UpdateCourseCommand(
            CourseId: Guid.NewGuid(),
            UpdateCourseDto: new UpdateCourseDto(
                Title: "Valid Title",
                Description: "Valid Description",
                Headline: "Valid Headline",
                Prerequisites: "Valid Prerequisites",
                Objectives: "Valid Objectives",
                TargetAudiences: "Valid Target Audiences",
                Price: -50 // Invalid Price
            )
        );
    }

    public static UpdateCourseCommand GetInvalidUpdateCourseCommand_ZeroTimeEstimation()
    {
        return new UpdateCourseCommand(
            CourseId: Guid.NewGuid(),
            UpdateCourseDto: new UpdateCourseDto(
                Title: "Valid Title",
                Description: "Valid Description",
                Headline: "Valid Headline",
                Prerequisites: "Valid Prerequisites",
                Objectives: "Valid Objectives",
                TargetAudiences: "Valid Target Audiences",
                Price: 100
            )
        );
    }
}
