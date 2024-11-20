using BuildingBlocks.CQRS;
using Microsoft.AspNetCore.Routing;
using User.Application.Models.PointHistories.Queries.GetTotalPoints;
using User.Application.Models.PointHistories.Dtos;

namespace User.API.Endpoints.PointHistories
{
    public record GetTotalPointsResponse(long TotalPoints);

    public class GetTotalPointsEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/user-service/UserId/{UserId}/total-points", async (Guid UserId, ISender sender) =>
            {
                // Gửi truy vấn để lấy tổng số điểm của người dùng
                var totalPoints = await sender.Send(new GetTotalPointsByUserIdQuery(UserId));

                // Tạo đối tượng trả về với tổng số điểm
                var response = new GetTotalPointsResponse(totalPoints);

                // Trả về kết quả với mã HTTP 200 OK
                return Results.Ok(response);
            })
            .WithName("GetTotalPointsByUserId")
            .Produces<GetTotalPointsResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSummary("Get Total Points by UserId");
        }
    }
}
