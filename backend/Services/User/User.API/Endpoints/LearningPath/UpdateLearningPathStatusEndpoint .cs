using BuildingBlocks.CQRS;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using User.Application.Models.LearningPaths.Commands.UpdateLearningPathStatus;
using User.Domain.Enums;

namespace User.API.Endpoints.LearningPaths
{
    public class UpdateLearningPathStatusEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPut("/user-service/learningpaths/{id}/status", async (Guid id, LearningPathStatus status, ISender sender) =>
            {
                // Tạo command với id và status
                var command = new UpdateLearningPathStatusCommand(id, status);

                // Gửi command để xử lý cập nhật
                var result = await sender.Send(command);

                // Trả về kết quả
                return result
                    ? Results.NoContent() // Nếu cập nhật thành công, trả về 204 No Content
                    : Results.BadRequest("Không thể cập nhật trạng thái LearningPath.");
            })
            .WithName("UpdateLearningPathStatus") // Tên endpoint
            .Produces(StatusCodes.Status204NoContent) // Trả về 204 No Content khi thành công
            .ProducesProblem(StatusCodes.Status400BadRequest) // Trả về 400 Bad Request khi có lỗi
            .WithSummary("Cập nhật trạng thái của LearningPath"); // Mô tả ngắn gọn về endpoint
        }
    }
}
