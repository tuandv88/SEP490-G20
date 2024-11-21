using Learning.Application.Models.Quizs.Commands.CreateQuiz;
using Learning.Application.Models.Quizs.Dtos;

namespace Learning.API.Endpoints.Quizs;

public record CreateQuizRequest(CreateQuizDto CreateQuizDto);
public record CreateQuizResponse(Guid Id);
public class CreateQuizEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPost("/quizs", async (Guid? LectureId, CreateQuizRequest request, ISender sender) => {
            var command = new CreateQuizCommand() { LectureId = LectureId, CreateQuizDto = request.CreateQuizDto };

            var result = await sender.Send(command);

            var response = result.Adapt<CreateQuizResponse>();

            return Results.Created($"/quizs/{response.Id}", response);
        })
        .WithName("CreateQuiz")
        .Produces<CreateQuizResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create Quiz");
    }
}

