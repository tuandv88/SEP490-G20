using Learning.Application.Models.Courses.Commands.UpdateCourseImage;

namespace Learning.API.Endpoints.Courses;
public record UpdateCourseImageRequest(Guid CourseId, ImageDto ImageDto);
public record UpdateCourseImageRepsonse(string PresignedUrl);
public class UpdateCourseImageEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPut("/courses/image", async (UpdateCourseImageRequest request, ISender sender) => {
            var command = request.Adapt<UpdateCourseImageCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<UpdateCourseImageRepsonse>();

            return Results.Ok(response);
        })
        .WithName("UpdateCourseImage")
        .Produces<UpdateCourseResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update course image");
    }
}
