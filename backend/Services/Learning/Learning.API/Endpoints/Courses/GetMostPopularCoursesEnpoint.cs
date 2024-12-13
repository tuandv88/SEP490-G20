using Learning.Application.Models.Courses.Queries.GetMostPopularCourses;

namespace Learning.API.Endpoints.Courses;

public record GetMostPopularCoursesResponse(PaginatedResult<CourseBasicDto> CourseDtos);
public class GetMostPopularCoursesEnpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/courses/most-popular", async ([AsParameters] PaginationRequest request, ISender sender) => {
            var result = await sender.Send(new GetMostPopularCoursesQuery(request));

            var response = result.Adapt<GetMostPopularCoursesResponse>();

            return Results.Ok(response);

        })
        .WithName("GetCoursesMostPopular")
        .Produces<GetMostPopularCoursesResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Courses Most Popular");
    }
}
