using Learning.Application.Models.Submissions.Commands.CreateSubmission;
using Learning.Application.Models.Submissions.Dtos;

namespace Learning.API.Endpoints.Submissions;
public record CreateSubmissionRequest(SubmissionDto SubmissionDto);
public record CreateSubmissionResponse(SubmissionResponse SubmissionResponse);
public class CreateSubmissionEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapPost("/submission", async (CreateSubmissionRequest request, ISender sender) => {
            var command = request.Adapt<CreateSubmissionCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<CreateSubmissionResponse>();

            return Results.Created($"/submission/{response.SubmissionResponse.Token}", response);
        })
        .WithName("CreateSubmission")
        .Produces<CreateSubmissionResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create submission");
    }
}

