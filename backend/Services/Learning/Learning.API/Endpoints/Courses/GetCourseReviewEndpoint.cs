using Learning.Application.Models.Courses.Queries.GetCourseReviews;

namespace Learning.API.Endpoints.Courses;

public record GetCourseReviewResponse(CourseReviewSummaryDto CourseReviews);
public class GetCourseReviewEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/courses/{Id}/reviews", async ([AsParameters] PaginationRequest request, Guid Id, ISender sender) => {
            var result = await sender.Send(new GetCourseReviewsQuery(request, Id));

            var response = result.Adapt<GetCourseReviewResponse>();

            return Results.Ok(response);

        })
        .WithName("GetCourseReview")
        .Produces<GetCourseReviewResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Course review");
    }
}