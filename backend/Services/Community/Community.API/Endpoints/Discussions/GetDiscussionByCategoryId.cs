using BuildingBlocks.Pagination;
using Community.Application.Models.Discussions.Queries.GetDiscussionByCategoryId;
using Community.Application.Models.Discussions.Dtos;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Community.API.Endpoints.Discussions;
// Định nghĩa Response bao gồm kết quả phân trang
public record GetDiscussionsResponse(PaginatedResult<DiscussionDto> DiscussionDtos);
public class GetDiscussionsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/discussions/{categoryId:guid}", async (Guid categoryId, [AsParameters] PaginationRequest request, ISender sender) =>
        {
            var result = await sender.Send(new GetDiscussionByCateIdQuery(categoryId, request));

            var response = result.Adapt<GetDiscussionsResponse>();

            return Results.Ok(response);
        })
        .WithName("GetDiscussions")
        .Produces<GetDiscussionsResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Discussions with Pagination by CategoryId");
    }
}
