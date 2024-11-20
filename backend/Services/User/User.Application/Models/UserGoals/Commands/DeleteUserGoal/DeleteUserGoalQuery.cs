using BuildingBlocks.CQRS;
using System;

namespace User.Application.Models.UserGoals.Commands.DeleteUserGoal
{
    // Định nghĩa truy vấn để xóa UserGoal dựa trên UserGoalId
    public record DeleteUserGoalQuery(Guid UserGoalId) : IQuery<bool>;
}
