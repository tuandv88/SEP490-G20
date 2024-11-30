using Learning.Application.Models.Courses.Queries.GetStatistics.GetMostPopularCourseWithEnrollments;

namespace Learning.API.Endpoints.Statistics;
public record GetMostPopularCourseWithEnrollmentsResponse(PaginatedResult<CourseWithEnrollmentDto> Courses);
public class GetMostPopularCourseWithEnrollmentsEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/statistics/courses/most-popular", async ([AsParameters]PaginationRequest request, ISender sender) => {

            var result = await sender.Send(new GetMostPopularCourseWithEnrollmentsQuery(request));
            var response = result.Adapt<GetMostPopularCourseWithEnrollmentsResponse>();

            return Results.Ok(response);

        })
        .WithName("GetMostPopularCourseWithEnrollments")
        .Produces<GetMostPopularCourseWithEnrollmentsResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Most Popular Course With Enrollments");
    }
}
