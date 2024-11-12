using Amazon.Runtime.Internal;
using MediatR;
using User.Application.Models.Dtos;
using User.Application.Models.UserGoals.Dtos;

namespace User.Application.Models.UserGoals.Commands.CreateUserGoal;
public record CreateUserGoalResult(Guid Id);
public class CreateUserGoalCommand : IRequest<CreateUserGoalResult>
{
    public required Guid UserId { get; set; }
    public required UserGoalDto UserGoalDto { get; set; }
}
