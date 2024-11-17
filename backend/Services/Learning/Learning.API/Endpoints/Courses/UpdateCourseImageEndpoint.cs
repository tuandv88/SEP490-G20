using Learning.Application.Models.Courses.Commands.UpdateCourseImage;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Courses;
public record UpdateCourseImageRequest(ImageDto ImageDto);
public record UpdateCourseImageRepsonse(string PresignedUrl);
public class UpdateCourseImageEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPut("/courses/{CourseId}/image", async ([FromRoute] Guid CourseId, UpdateCourseImageRequest request, ISender sender) => {

            var result = await sender.Send(new UpdateCourseImageCommand(CourseId, request.ImageDto));

            var response = result.Adapt<UpdateCourseImageRepsonse>();

            return Results.Ok(response);
        })
        .WithName("UpdateCourseImage")
        .Produces<UpdateCourseResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update course image");
    }
}
