using Amazon.Runtime.Internal;
using FluentValidation;
using MediatR;
using User.Application.Models.Dtos;
using User.Application.Models.UserGoals.Dtos;

namespace User.Application.Models.UserGoals.Commands.CreateUserGoal;
public record CreateUserGoalResult(Guid Id);
public class CreateUserGoalCommand : IRequest<CreateUserGoalResult>
{
    public required Guid UserId { get; set; }
    public required UserGoalDto UserGoalDto { get; set; }
    public class CreateUserGoalCommandValidator : AbstractValidator<CreateUserGoalCommand>
    {
        public CreateUserGoalCommandValidator()
        {
            // Validate UserGoalDto
            RuleFor(x => x.UserGoalDto)
                .NotNull()
                .WithMessage("UserGoalDto cannot be null.");

            // Validate GoalType (it must not be empty)
            RuleFor(x => x.UserGoalDto.GoalType)
                .NotEmpty()
                .WithMessage("GoalType is required.");

            // Validate TargetDate to ensure it is a valid future date
            RuleFor(x => x.UserGoalDto.TargetDate)
                .NotNull()
                .WithMessage("TargetDate is required.")
                .GreaterThanOrEqualTo(DateTime.Now)
                .WithMessage("TargetDate must be a future date.");

            // Validate Status to ensure it is a valid enum value
            RuleFor(x => x.UserGoalDto.Status)
                .IsInEnum()
                .WithMessage("Status must be a valid value.");
        }
    }
}
