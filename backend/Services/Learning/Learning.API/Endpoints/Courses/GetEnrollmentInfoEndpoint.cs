using Learning.Application.Models.Courses.Queries.GetStatusEnrollment;

namespace Learning.API.Endpoints.Courses;
public record GetEnrollmentInfoResponse(UserEnrollmentDto? EnrollmentInfo);
public class GetEnrollmentInfoEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/courses/{Id}/enrollment/info", async (Guid Id, ISender sender) => {
            var result = await sender.Send(new GetEnrollmentInfoQuery(Id));

            var response = result.Adapt<GetEnrollmentInfoResponse>();

            return Results.Ok(response);

        })
        .WithName("GetEnrollmentInfo")
        .Produces<GetEnrollmentInfoResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get enrollment info");
    }
}

