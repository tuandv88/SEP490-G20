using User.API.Endpoints.PointHistory;
using User.Application.Models.PointHistories.Commands.CreatePointHistory;
using User.Application.Models.UserGoals.Commands.CreateUserGoal;
using User.Application.Models.UserGoals.Dtos;

namespace User.API.Endpoints.UserGoal;
public record CreateUserGoalRequest(UserGoalDto UserGoalDto);
public record CreateUserGoalResponse(Guid Id);
public class CreateUserGoalEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/user-service/user/{userId}/UserGoal", async (Guid userId, CreateUserGoalRequest request, ISender sender) =>
        {
            
            var command = new CreateUserGoalCommand
            {
                UserId = userId,
                UserGoalDto = request.UserGoalDto // Sử dụng đúng kiểu DTO
            };

            // Gửi command qua MediatR
            var result = await sender.Send(command);

            // Ánh xạ kết quả trả về thành CreatePointHistoryResponse
            var response = result.Adapt<CreateUserGoalResponse>();

            // Trả về HTTP 201 với đường dẫn của PointHistory vừa tạo
            return Results.Created($"/user-service/user/{userId}/UserGoal/{response.Id}", response);

        })
           .WithName("CreateUserGoal") // Đặt tên cho endpoint
           .Produces<CreatePointHistoryResponse>(StatusCodes.Status201Created) // Trả về khi tạo thành công
           .ProducesProblem(StatusCodes.Status400BadRequest) // Trả về lỗi nếu request không hợp lệ
           .WithSummary("Create User Goal for a user"); // Thêm mô tả cho endpoint
    }
}
