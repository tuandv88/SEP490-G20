using Learning.Application.Models.Courses.Queries.GetCourseById;

namespace Learning.API.Endpoints.Courses;

public record GetCourseByIdResponse(CourseDto CourseDto);
public class GetCourseByIdEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/courses/{Id}", async (Guid Id, ISender sender) => {
            var result = await sender.Send(new GetCourseByIdQuery(Id));

            var response = result.Adapt<GetCourseByIdResponse>();

            return Results.Ok(result);

        })
        .WithName("GetCourseById")
        .Produces<GetCourseResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Course by Id");
    }
}

