using Learning.Application.Models.Courses.Queries.GetCourseDetails;

namespace Learning.API.Endpoints.Courses;

public record GetCourseDetailsResponse(CourseDetailsDto CourseDetailsDto);
public class GetCourseDetailsEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/courses/{Id}/details", async (Guid Id, ISender sender) => {
            var result = await sender.Send(new GetCourseDetailsQuery(Id));

            var response = result.Adapt<GetCourseDetailsResponse>();

            return Results.Ok(response);

        })
        .WithName("GetCourseByIdDetails")
        .Produces<GetCourseDetailsResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Course by Id details");
    }
}
