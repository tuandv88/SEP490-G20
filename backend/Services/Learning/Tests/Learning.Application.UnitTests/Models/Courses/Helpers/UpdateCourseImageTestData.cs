using System;
using Learning.Application.Models.Courses.Commands.UpdateCourseImage;
using Learning.Application.Models.Courses.Dtos;

namespace Learning.Tests.Application.UnitTest.Models.Course.Helpers;

public static class UpdateCourseImageTestData
{
    public static UpdateCourseImageCommand GetValidUpdateCourseImageCommand()
    {
        return new UpdateCourseImageCommand(
            CourseId: Guid.NewGuid(),
            ImageDto: new ImageDto(
                FileName: "validImage.png",
                Base64Image: "validBase64Image",
                ContentType: "image/png"
            )
        );
    }

    public static UpdateCourseImageCommand GetInvalidUpdateCourseImageCommand_EmptyFileName()
    {
        return new UpdateCourseImageCommand(
            CourseId: Guid.NewGuid(),
            ImageDto: new ImageDto(
                FileName: "", // Invalid FileName
                Base64Image: "fakeBase64Image",
                ContentType: "image/png"
            )
        );
    }

    public static UpdateCourseImageCommand GetInvalidUpdateCourseImageCommand_InvalidBase64()
    {
        return new UpdateCourseImageCommand(
            CourseId: Guid.NewGuid(),
            ImageDto: new ImageDto(
                FileName: "validImage.png",
                Base64Image: "invalidBase64Data", // Invalid Base64
                ContentType: "image/png"
            )
        );
    }
}
