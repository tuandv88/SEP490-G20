using Learning.Application.Models.Submissions.Commands.CreateBatchCodeExcute;
using Learning.Application.Models.Submissions.Dtos.CodeExecution;

namespace Learning.API.Endpoints.Submissions;

public record CreateBatchSubmissionRequest(BatchCodeExecuteDto BatchCodeExecuteDto);
public record CreateBatchSubmissionResponse(List<CodeExecuteDto> CodeExecuteDtos);

public class CreateBatchSubmissionEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapPost("/submissions/batch", async (CreateBatchSubmissionRequest request, ISender sender) => {
            var command = request.Adapt<CreateBatchCodeExcuteCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<CreateBatchSubmissionResponse>();

            return Results.Created($"/submissions/batch", response);
        })
        .WithName("CreateBatchSubmission")
        .Produces<CreateBatchSubmissionResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create batch submission");
    }
}