using Learning.Application.Models.Courses.Commands.CreateCoureReview;
using Learning.Application.Models.Courses.Queries.GetCourseReviews;

namespace Learning.API.Endpoints.Courses;

public record CreateCourseReviewRequest(CreateCourseReviewDto CourseReview);
public record CreateCourseReviewResponse(bool IsSuccess);
public class CreateCourseReivewEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapPut("/courses/{Id}/reviews", async (Guid Id, CreateCourseReviewRequest request, ISender sender) => {
            var result = await sender.Send(new CreateCoureReviewCommand(request.CourseReview, Id));

            var response = result.Adapt<CreateCourseReviewResponse>();

            return Results.Ok(response);

        })
        .WithName("CreateCourseReview")
        .Produces<CreateCourseReviewResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Create Course review");
    }
}