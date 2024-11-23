using BuildingBlocks.CQRS;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using User.Application.Models.LearningPaths.Commands.UpdateLearningPath;
using User.Application.Models.LearningPaths.Dtos;

namespace User.API.Endpoints.LearningPaths
{
    public class UpdateLearningPathEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            // Endpoint PUT để cập nhật LearningPath
            app.MapPut("/learningpaths", async ( UpdateLearningPathDto learningPathDto, ISender sender) =>
            {
                // Tạo command để gửi tới handler
                var command = new UpdateLearningPathCommand(learningPathDto);

                // Gửi command để xử lý cập nhật
                var result = await sender.Send(command);

                // Trả về kết quả
                return result
                    ? Results.NoContent() // Nếu cập nhật thành công, trả về 204 No Content
                    : Results.BadRequest("Không thể cập nhật LearningPath."); // Nếu có lỗi, trả về BadRequest
            })
            .WithName("UpdateLearningPath") // Tên endpoint
            .Produces(StatusCodes.Status204NoContent) // Trả về 204 No Content khi thành công
            .ProducesProblem(StatusCodes.Status400BadRequest) // Trả về 400 Bad Request khi có lỗi
            .WithSummary("Cập nhật thông tin LearningPath"); // Mô tả ngắn gọn về endpoint
        }
    }
}
