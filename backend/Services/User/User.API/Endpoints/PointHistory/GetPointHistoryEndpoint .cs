using BuildingBlocks.CQRS;
using Microsoft.AspNetCore.Routing;
using User.Application.Models.PointHistories.Queries;
using User.Application.Models.PointHistories.Dtos;
using User.Application.Models.PointHistories.Queries.GetPointHistories;

namespace User.API.Endpoints.PointHistories
{
    public record GetPointHistoryResponse(List<PointHistoryDto> PointHistories);
    public class GetPointHistoryEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/UserId/{UserId}/point-history", async (Guid UserId, ISender sender) =>
            {
                var result = await sender.Send(new GetPointHistoryByUserIdQuery(UserId));

                var response = new GetPointHistoryResponse(result.PointHistories);

                return Results.Ok(response);
            })
            .WithName("GetPointHistoryByUserId")
            .Produces<GetPointHistoryResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSummary("Get Point History by UserId");
        }
    }
}
