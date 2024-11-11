using Community.Application.Models.Discussions.Queries.GetDiscussionByCategoryId;
using Community.Application.Models.Discussions.Dtos;

namespace Community.API.Endpoints.Discussions;
// Định nghĩa Response bao gồm kết quả phân trang
public record GetDiscussionsByCateIdResponse(PaginatedResult<DiscussionDto> DiscussionDtos);
public class GetDiscussionsByCateIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/discussions/{categoryId:guid}/bycategoryid", async (Guid categoryId, [AsParameters] PaginationRequest request, ISender sender) =>
        {
            var result = await sender.Send(new GetDiscussionByCateIdQuery(categoryId, request));

            var response = result.Adapt<GetDiscussionsByCateIdResponse>();

            return Results.Ok(response);
        })
        .WithName("GetDiscussionsByCateId")
        .Produces<GetDiscussionsByCateIdResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Discussions with Pagination by CategoryId");
    }
}
