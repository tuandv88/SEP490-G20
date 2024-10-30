using Learning.Application.Models.Questions.Commands.CreateQuestion;
using Learning.Application.Models.Questions.Dtos;

namespace Learning.API.Endpoints.Questions;

public record CreateQuestionRequest(CreateQuestionDto CreateQuestionDto);
public record CreateQuestionResponse(Guid Id);
public class CreateQuestionEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPost("/quizs/{QuizId}/questions", async (Guid QuizId, CreateQuestionRequest request, ISender sender) => {
            var command = new CreateQuestionCommand() { QuizId = QuizId, CreateQuestionDto = request.CreateQuestionDto };

            var result = await sender.Send(command);

            var response = result.Adapt<CreateQuestionResponse>();

            return Results.Created($"/quizs/{QuizId}/questions/{response.Id}", response);
        })
        .WithName("CreateQuestion")
        .Produces<CreateQuestionResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create Question");
    }
}


