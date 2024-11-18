using AI.Application.Models.Messages.Dtos;
using AI.Application.Models.Messages.Queries;

namespace AI.API.Enpoints.Messages;

public record GetMessagesReponse(PaginatedResult<MessageDto> Messages);
public class GetMessagesEnpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/conversations/{ConversationId}/messages", async (Guid ConversationId, [AsParameters] PaginationRequest request, ISender sender) => {
            var result = await sender.Send(new GetMessagesQuery(ConversationId, request));

            var response = result.Adapt<GetMessagesReponse>();

            return Results.Ok(response);

        })
       .WithName("GetMessages")
       .Produces<GetMessagesReponse>(StatusCodes.Status200OK)
       .ProducesProblem(StatusCodes.Status400BadRequest)
       .ProducesProblem(StatusCodes.Status404NotFound)
       .WithSummary("Get messages");
    }
}