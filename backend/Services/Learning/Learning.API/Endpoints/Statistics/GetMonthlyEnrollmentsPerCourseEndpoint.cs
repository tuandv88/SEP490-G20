using Learning.Application.Models.Courses.Queries.GetStatistics.GetMonthlyEnrollmentsPerCourse;

namespace Learning.API.Endpoints.Statistics;
public record GetMonthlyEnrollmentsPerCourseRequest(DateTime StartTime, DateTime EndTime, int CoursePerMonth);
public record GetMonthlyEnrollmentsPerCourseResponse(List<MonthlyCourseEnrollmentDto> MonthlyCourseEnrollments);
public class GetMonthlyEnrollmentsPerCourseEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/statistics/courses/enrollments/monthly", async ([AsParameters]GetMonthlyEnrollmentsPerCourseRequest request,ISender sender) => {

            var result = await sender.Send(new GetMonthlyEnrollmentsPerCourseQuery(request.StartTime, request.EndTime, request.CoursePerMonth));
            var response = result.Adapt<GetMonthlyEnrollmentsPerCourseResponse>();

            return Results.Ok(response);

        })
        .WithName("GetMonthlyEnrollmentsPerCourse")
        .Produces<GetMonthlyEnrollmentsPerCourseResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Monthly Enrollments Per Course");
    }
}
