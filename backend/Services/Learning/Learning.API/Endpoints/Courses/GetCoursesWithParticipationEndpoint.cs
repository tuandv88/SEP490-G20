using Amazon.S3.Model;
using Learning.Application.Models.Courses.Queries.GetCoursesWithParticipation;

namespace Learning.API.Endpoints.Courses;

public record GetCoursesWithParticipationResponse(PaginatedResult<CourseWithParticipationDto> Courses);
public class GetCoursesWithParticipationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/courses/with-participation",
                async ([AsParameters] PaginationRequest request, string? courseIds,[AsParameters] GetCoursesWithParticipationFilter filter, ISender sender) =>
                {
                    var courseIdArray = courseIds?.Split(',');
                    var result = await sender.Send(new GetCoursesWithParticipationQuery(request, courseIdArray, filter));

                    var response = result.Adapt<GetCoursesWithParticipationResponse>();

                    return Results.Ok(response);
                })
            .WithName("GetCoursesWithParticipation")
            .Produces<GetCoursesWithParticipationResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSummary("Get Courses With Participation Response");
    }
}