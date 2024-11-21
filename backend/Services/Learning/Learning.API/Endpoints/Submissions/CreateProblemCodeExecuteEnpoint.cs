
using Learning.Application.Models.Submissions.Commands.CreateCodeExecute;
using Learning.Application.Models.Submissions.Commands.CreateSubmission;
using Learning.Application.Models.Submissions.Dtos;

namespace Learning.API.Endpoints.Submissions;

public record CreateProblemCodeExecuteRequest(CreateCodeExecuteDto CreateCodeExecuteDto);
public record CreateProblemCodeExecuteResponse(CodeExecuteDto CodeExecuteDto);
public class CreateProblemCodeExecuteEnpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapPost("/problems/{ProblemId}/run", async (Guid ProblemId, CreateProblemCodeExecuteRequest request, ISender sender) => {
            var command = new CreateProblemCodeExecuteCommand(ProblemId, request.CreateCodeExecuteDto);
  
            var result = await sender.Send(command);

            var response = result.Adapt<CreateProblemCodeExecuteResponse>();

            return Results.Ok(response);
        })
            .WithName("CreateProblemSubmission")
            .Produces<CreateProblemCodeExecuteResponse>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .WithSummary("Create Problem submission");


    }
}

