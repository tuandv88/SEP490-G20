using AI.Application.Models.Conversations.Commands.DeleteConversation;

namespace AI.API.Enpoints.Conversations;
public class DeleteConversationEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapDelete("/conversations/{conversationId}", async (Guid conversationId, ISender sender) => {

            var result = await sender.Send(new DeleteConversationCommand(conversationId));

            return Results.NoContent();
        })
       .WithName("DeleteConversation")
       .Produces(StatusCodes.Status204NoContent)
       .ProducesProblem(StatusCodes.Status404NotFound)
       .WithSummary("Delete conversation");
    }
}
