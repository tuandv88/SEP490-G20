using AI.Application.Models.Conversations.Dtos;
using AI.Application.Models.Conversations.Queries.GetConversations;

namespace AI.API.Enpoints.Conversations;

public record GetConversationsResponse(PaginatedResult<ConversationDto> Conversations);
public class GetConversationsEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/conversations", async ([AsParameters] PaginationRequest request, ISender sender) => {
            var result = await sender.Send(new GetConversationsQuery(request));

            var response = result.Adapt<GetConversationsResponse>();

            return Results.Ok(response);

        })
       .WithName("GetConversations")
       .Produces<GetConversationsResponse>(StatusCodes.Status200OK)
       .ProducesProblem(StatusCodes.Status400BadRequest)
       .ProducesProblem(StatusCodes.Status404NotFound)
       .WithSummary("Get conversations");
    }
}
