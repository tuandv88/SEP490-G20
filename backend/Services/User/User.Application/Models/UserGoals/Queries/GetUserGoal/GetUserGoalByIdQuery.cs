using System;
using BuildingBlocks.CQRS; // Đảm bảo đã import thư viện CQRS nếu đang dùng
using User.Application.Models.UserGoals.Dtos;

namespace User.Application.Models.UserGoals.Queries.GetUserGoal
{
    // Định nghĩa truy vấn để lấy tất cả UserGoal theo UserId
    public record GetUserGoalsByUserIdQuery(Guid UserId) : IQuery<GetUserGoalsByUserIdQueryResult>;

    // Định nghĩa kết quả truy vấn bao gồm danh sách UserGoalDto
    public record GetUserGoalsByUserIdQueryResult(List<UserGoalDto> UserGoals);
}
