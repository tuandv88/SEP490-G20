using Learning.Application.Models.Courses.Queries;
using Learning.Application.Models.Courses.Queries.GetCoursePreviewById;

namespace Learning.API.Endpoints.Courses;

public record GetCourseByIdResponse(CoursePreviewDto Course);
public class GetCourseByIdEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/courses/{Id}", async (Guid Id, ISender sender) => {
            var result = await sender.Send(new GetCoursePreviewByIdQuery(Id));

            var response = result.Adapt<GetCourseByIdResponse>();

            return Results.Ok(response);

        })
        .WithName("GetCoursePreviewById")
        .Produces<GetCourseByIdResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Course preview by Id");
    }
}

