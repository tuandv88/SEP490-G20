using BuildingBlocks.CQRS;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using User.Application.Models.PathSteps.Dtos;

namespace User.Application.Models.PathSteps.Commands.CreatePathStep
{
    [Authorize]
    public record CreatePathStepCommand : ICommand<CreatePathStepResult>
    {
      
        public required CreatePathStepDto CreatePathStepDto { get; set; }
    }

    public record CreatePathStepResult(Guid Id);

    public class CreatePathStepCommandValidator : AbstractValidator<CreatePathStepCommand>
    {
        public CreatePathStepCommandValidator()
        {
            // Validate PathStepDto
            RuleFor(x => x.CreatePathStepDto)
                .NotNull()
                .WithMessage("PathStepDto cannot be null.");

            // Validate StepOrder to be greater than 0
            RuleFor(x => x.CreatePathStepDto.StepOrder)
                .GreaterThan(0)
                .WithMessage("StepOrder must be greater than 0.");

            // Validate Status to be a valid enum value
            RuleFor(x => x.CreatePathStepDto.Status)
                .IsInEnum()
                .WithMessage("Status is invalid.");

            // Validate EnrollmentDate to be not null and less than or equal to ExpectedCompletionDate
            RuleFor(x => x.CreatePathStepDto.EnrollmentDate)
                .NotNull()
                .WithMessage("EnrollmentDate cannot be null.")
                .LessThanOrEqualTo(x => x.CreatePathStepDto.ExpectedCompletionDate)
                .WithMessage("EnrollmentDate must be less than or equal to ExpectedCompletionDate.");

            // Validate CompletionDate if provided to be less than or equal to ExpectedCompletionDate
            RuleFor(x => x.CreatePathStepDto.CompletionDate)
                .LessThanOrEqualTo(x => x.CreatePathStepDto.ExpectedCompletionDate)
                .When(x => x.CreatePathStepDto.CompletionDate.HasValue)
                .WithMessage("CompletionDate must be less than or equal to ExpectedCompletionDate.");
        }
    }

}
