using Learning.Application.Models.Problems.Commands.CreateProblem;
using Learning.Application.Models.Problems.Dtos;

namespace Learning.API.Endpoints.Problems;

public record CreateProbleRequest(CreateProblemDto CreateProblemDto);
public record CreateProbleResponse(Guid Id);
public class CreateProblemEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPost("/problems", async (Guid? LectureId, CreateProbleRequest request, ISender sender) => {
            var command = new CreateProblemCommand() { LectureId = LectureId, CreateProblemDto = request.CreateProblemDto };

            var result = await sender.Send(command);

            var response = result.Adapt<CreateProbleResponse>();

            return Results.Created($"/problems/{response.Id}", response);
        })
        .WithName("CreateProblem")
        .Produces<CreateProbleResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create Problem");
    }
}

