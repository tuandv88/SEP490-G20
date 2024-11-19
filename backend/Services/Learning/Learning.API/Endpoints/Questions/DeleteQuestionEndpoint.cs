using Learning.Application.Models.Questions.Commands.DeleteQuestion;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Questions {
    public class DeleteQuestionEndpoint : ICarterModule {
        public void AddRoutes(IEndpointRouteBuilder app) {
            app.MapDelete("/quizs/{QuizId}/questions/{QuestionId}", async ([FromRoute] Guid QuizId, [FromRoute] Guid QuestionId, ISender sender) => {

                await sender.Send(new DeleteQuestionCommand(QuizId, QuestionId));

                return Results.NoContent();
            })
           .WithName("DeleteQuestions")
           .Produces(StatusCodes.Status204NoContent)
           .ProducesProblem(StatusCodes.Status404NotFound)
           .WithSummary("Delete questions");
        }
    }
}
