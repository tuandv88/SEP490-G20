using MediatR;
using User.Application.Models.LearningPaths.Queries.DeleteLearningPath;
using Microsoft.AspNetCore.Http;

namespace User.API.Endpoints.LearningPath
{
    public class DeleteLearningPathEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapDelete("/user-service/user/{userId}/learningpaths/{learningPathId}", async (Guid userId, Guid learningPathId, ISender sender) =>
            {
                // Tạo query từ yêu cầu xóa LearningPath và các PathStep liên quan
                var query = new DeleteLearningPathQuery(learningPathId);

                // Gửi query qua MediatR để xử lý
                var result = await sender.Send(query);

                if (result)
                {
                    // Trả về HTTP 204 No Content nếu xóa thành công
                    return Results.NoContent();
                }

                // Nếu không xóa thành công, trả về lỗi 404 Not Found
                return Results.NotFound($"LearningPath with ID {learningPathId} not found.");
            })
            .WithName("DeleteLearningPath") // Đặt tên cho endpoint
            .Produces(StatusCodes.Status204NoContent) // Trả về khi xóa thành công
            .ProducesProblem(StatusCodes.Status400BadRequest) // Trả về lỗi nếu request không hợp lệ
            .WithSummary("Delete a LearningPath and all related PathSteps by its ID"); // Mô tả cho endpoint
        }
    }
}
