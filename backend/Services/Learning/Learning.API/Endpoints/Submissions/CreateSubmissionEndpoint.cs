using Learning.Application.Models.Submissions.Commands.CreateSubmission;
using Learning.Application.Models.Submissions.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Submissions;
public record CreateSubmissionRequest(SubmissionCodeDto Submission);
public record CreateSubmissionResponse(Guid SubmissionId, SubmissionResponseDto SubmissionResponse);
public class CreateSubmissionEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapPost("/problems/{ProblemId}/submission", async ([FromRoute]Guid ProblemId, CreateSubmissionRequest request, ISender sender) => {
            var command = new CreateSubmissionCommand(ProblemId, request.Submission);

            var result = await sender.Send(command);

            var response = result.Adapt<CreateSubmissionResponse>();

            return Results.Created($"/problems/{ProblemId}/submission/{response.SubmissionId}", response);
        })
        .WithName("CreateSubmission")
        .Produces<CreateSubmissionResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create submission");
    }
}

