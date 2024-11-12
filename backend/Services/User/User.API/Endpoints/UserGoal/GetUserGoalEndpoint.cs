using User.Application.Models.UserGoals.Dtos;
using Carter;
using MediatR;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using User.Application.Models.PathSteps.Queries.GetLeaningPathById;
using User.Application.Models.UserGoals.Commands.GetUserGoal;

namespace User.API.Endpoints.UserGoal;

public record GetUserGoalResponse(List<UserGoalDto> UserGoalDtos);  // Chỉnh sửa lớp phản hồi để hỗ trợ danh sách

public class GetUserGoalEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/user-service/UserGoals/{UserId}", async (Guid UserId, ISender sender) =>
        {
            // Gửi truy vấn lấy UserGoal qua MediatR
            var result = await sender.Send(new GetUserGoalsByUserIdQuery(UserId));

            // Kiểm tra nếu không tìm thấy UserGoal
            if (result == null || result.UserGoals.Count == 0)  // Kiểm tra nếu không có dữ liệu
            {
                return Results.NotFound(new { message = " UserGoal not found or invalid UserId." });
            }

            // Chuyển đổi kết quả thành GetUserGoalResponse
            var response = new GetUserGoalResponse(result.UserGoals.Adapt<List<UserGoalDto>>());

            return Results.Ok(response);  // Trả về kết quả với danh sách UserGoalDto
        })
        .WithName("GetUserGoalByUserId")
        .Produces<GetUserGoalResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get All  UserGoal By UserId");
    }
}
