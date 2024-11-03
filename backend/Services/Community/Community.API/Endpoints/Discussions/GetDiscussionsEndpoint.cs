using Community.Application.Models.Discussions.Dtos;
using Community.Application.Models.Discussions.Queries.GetDiscussions;

namespace Community.API.Endpoints.Discussions;
public record GetDiscussionsResponse(List<DiscussionDto> DiscussionDtos);

public class GetDiscussionsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/discussions", async (ISender sender) =>
        {
            var result = await sender.Send(new GetDiscussionsQuery());

            var response = result.Adapt<GetDiscussionsResponse>();

            return Results.Ok(response);
        })
        .WithName("GetDiscussions")
        .Produces<GetDiscussionsResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get all Discussions");
    }
}


// Khi gửi GetCategoriesQuery thông qua MediatR (như với sender.Send(new GetCategoriesQuery())),
// -> MediatR sẽ tự động tìm và gọi GetCategoriesHandler để xử lý GetCategoriesQuery.
// -> Còn GetCategoriesHandler sẽ tự động inject Interface thao tác với Categories - Đã được implement ở Infrastructe