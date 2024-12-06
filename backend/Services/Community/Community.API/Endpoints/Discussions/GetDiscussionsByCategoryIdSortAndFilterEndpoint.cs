using Community.Application.Models.Discussions.Dtos;
using Community.Application.Models.Discussions.Queries.GetDiscussionsByCategoryIdSortAndFilter;
using Microsoft.AspNetCore.Mvc;

namespace Community.API.Endpoints.Discussions;

// Định nghĩa Response bao gồm kết quả phân trang
public record GetDiscussionsByCategoryIdSortAndFilterResponse(PaginatedResult<DiscussionDto> DiscussionDtos);

public class GetDiscussionsByCategoryIdSortAndFilterEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/discussions/{categoryId:guid}/options", async (Guid categoryId, [AsParameters] PaginationRequest request, string? orderBy, string? keySearch, string? tags, ISender sender) =>
        {
            var result = await sender.Send(new GetDiscussionsByCategoryIdSortAndFilterQuery(categoryId, request, orderBy, keySearch, tags));

            var response = result.Adapt<GetDiscussionsByCategoryIdSortAndFilterResponse>();

            return Results.Ok(response);
        })
        .WithName("GetDiscussionsByCategoryIdSortAndFilter")
        .Produces<GetDiscussionsByCateIdResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Discussions with Pagination by CategoryId, including sorting and tag filtering.");
    }
}
