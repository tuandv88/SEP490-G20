using Learning.Application.Models.Courses.Queries.GetCourses;

namespace Learning.API.Endpoints.Courses;
public record GetCourseResponse(PaginatedResult<CourseDto> CourseDtos);
public class GetCourseEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/courses", async ([AsParameters] PaginationRequest request, ISender sender) => {
            var result = await sender.Send(new GetCoursesQuery(request));

            var response = result.Adapt<GetCourseResponse>();

            return Results.Ok(response);

        })
        .WithName("GetCourses")
        .Produces<GetCourseResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Courses");
    }
}

