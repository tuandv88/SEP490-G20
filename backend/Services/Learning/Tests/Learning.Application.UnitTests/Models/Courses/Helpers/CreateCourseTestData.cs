using Learning.Application.Models.Courses.Commands.CreateCourse;
using Learning.Application.Models.Courses.Dtos;

namespace Learning.Tests.Application.UnitTest.Models.Courses.Helpers;

public static class CreateCourseTestData
{
    public static CreateCourseCommand GetValidCreateCourseCommand()
    {
        return new CreateCourseCommand(new CreateCourseDto(
            Title: "Valid Title",
            Description: "Valid Description",
            Headline: "Valid Headline",
            TimeEstimation: 10,
            Prerequisites: "Basic Knowledge",
            Objectives: "Learn CQRS",
            TargetAudiences: "Developers",
            Image: new ImageDto(
                FileName: "test.png",
                Base64Image: "fakeBase64Image",
                ContentType: "image/png"
            ),
            CourseLevel: "Basic",
            Price: 100
        ));
    }

    public static CreateCourseCommand GetInvalidCreateCourseCommand_NullTitle()
    {
        return new CreateCourseCommand(new CreateCourseDto(
            Title: null,
            Description: "Valid Description",
            Headline: "Valid Headline",
            TimeEstimation: 10,
            Prerequisites: "Basic Knowledge",
            Objectives: "Learn CQRS",
            TargetAudiences: "Developers",
            Image: new ImageDto(
                FileName: "test.png",
                Base64Image: "fakeBase64Image",
                ContentType: "image/png"
            ),
            CourseLevel: "Basic",
            Price: 100
        ));
    }

    public static CreateCourseCommand GetInvalidCreateCourseCommand_EmptyDescription()
    {
        return new CreateCourseCommand(new CreateCourseDto(
            Title: "Valid Title",
            Description: "",
            Headline: "Valid Headline",
            TimeEstimation: 10,
            Prerequisites: "Basic Knowledge",
            Objectives: "Learn CQRS",
            TargetAudiences: "Developers",
            Image: new ImageDto(
                FileName: "test.png",
                Base64Image: "fakeBase64Image",
                ContentType: "image/png"
            ),
            CourseLevel: "Basic",
            Price: 100
        ));
    }

    public static CreateCourseCommand GetInvalidCreateCourseCommand_NegativePrice()
    {
        return new CreateCourseCommand(new CreateCourseDto(
            Title: "Valid Title",
            Description: "Valid Description",
            Headline: "Valid Headline",
            TimeEstimation: 10,
            Prerequisites: "Basic Knowledge",
            Objectives: "Learn CQRS",
            TargetAudiences: "Developers",
            Image: new ImageDto(
                FileName: "test.png",
                Base64Image: "fakeBase64Image",
                ContentType: "image/png"
            ),
            CourseLevel: "Basic",
            Price: -1
        ));
    }

    public static CreateCourseCommand GetInvalidCreateCourseCommand_InvalidCourseLevel()
    {
        return new CreateCourseCommand(new CreateCourseDto(
            Title: "Valid Title",
            Description: "Valid Description",
            Headline: "Valid Headline",
            TimeEstimation: 10,
            Prerequisites: "Basic Knowledge",
            Objectives: "Learn CQRS",
            TargetAudiences: "Developers",
            Image: new ImageDto(
                FileName: "test.png",
                Base64Image: "fakeBase64Image",
                ContentType: "image/png"
            ),
            CourseLevel: "InvalidLevel",
            Price: 100
        ));
    }

    public static CreateCourseCommand GetInvalidCreateCourseCommand_ZeroTimeEstimation()
    {
        return new CreateCourseCommand(new CreateCourseDto(
            Title: "Valid Title",
            Description: "Valid Description",
            Headline: "Valid Headline",
            TimeEstimation: 0,
            Prerequisites: "Basic Knowledge",
            Objectives: "Learn CQRS",
            TargetAudiences: "Developers",
            Image: new ImageDto(
                FileName: "test.png",
                Base64Image: "fakeBase64Image",
                ContentType: "image/png"
            ),
            CourseLevel: "Basic",
            Price: 100
        ));
    }
}
