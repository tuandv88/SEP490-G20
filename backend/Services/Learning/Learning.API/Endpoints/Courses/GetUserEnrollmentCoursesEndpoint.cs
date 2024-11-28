using Learning.Application.Models.Courses.Queries.GetStatusEnrollment;
using Learning.Application.Models.Courses.Queries.GetUserEnrollmentCourses;

namespace Learning.API.Endpoints.Courses;
public record GetUserEnrollmentCoursesResponse(PaginatedResult<UserEnrollmentDetailsDto> CourseDtos);
public class GetUserEnrollmentCoursesEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/courses/u/enrollments", async ([AsParameters] PaginationRequest request, string? courseIds, ISender sender) => {
            var courseIdArray = courseIds?.Split(',');
            var result = await sender.Send(new GetUserEnrollmentCoursesQuery(request, courseIdArray));

            var response = result.Adapt<GetUserEnrollmentCoursesResponse>();

            return Results.Ok(response);

        })
        .WithName("GetUserEnrollmentCourses")
        .Produces<GetUserEnrollmentCoursesResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get user enrollment course");
    }
}
