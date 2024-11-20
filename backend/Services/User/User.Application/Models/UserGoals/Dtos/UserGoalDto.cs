using User.Domain.Enums;

namespace User.Application.Models.UserGoals.Dtos;

public record UserGoalDto(
       Guid Id,
       Guid UserId,
       string GoalType,
       DateTime TargetDate,
       GoalStatus Status
   );
