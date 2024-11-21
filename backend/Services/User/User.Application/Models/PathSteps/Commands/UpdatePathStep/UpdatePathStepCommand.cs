using FluentValidation;
using MediatR;
using User.Application.Models.PathSteps.Commands.CreatePathStep;
using User.Application.Models.PathSteps.Dtos;

namespace User.Application.Models.PathSteps.Commands.UpdatePathStep
{
    public record UpdatePathStepCommand(UpdatePathStepDto PathStepDto) : IRequest<bool>;

    public class CreatePathStepCommandValidator : AbstractValidator<CreatePathStepCommand>
    {
        public CreatePathStepCommandValidator()
        {
            // Validate PathStepDto
            RuleFor(x => x.PathStepDto)
                .NotNull()
                .WithMessage("PathStepDto cannot be null.");

            // Validate StepOrder to be greater than 0
            RuleFor(x => x.PathStepDto.StepOrder)
                .GreaterThan(0)
                .WithMessage("StepOrder must be greater than 0.");

            // Validate Status to be a valid enum value
            RuleFor(x => x.PathStepDto.Status)
                .IsInEnum()
                .WithMessage("Status is invalid.");

            // Validate EnrollmentDate to be not null and less than or equal to ExpectedCompletionDate
            RuleFor(x => x.PathStepDto.EnrollmentDate)
                .NotNull()
                .WithMessage("EnrollmentDate cannot be null.")
                .LessThanOrEqualTo(x => x.PathStepDto.ExpectedCompletionDate)
                .WithMessage("EnrollmentDate must be less than or equal to ExpectedCompletionDate.");

            // Validate CompletionDate if provided to be less than or equal to ExpectedCompletionDate
            RuleFor(x => x.PathStepDto.CompletionDate)
                .LessThanOrEqualTo(x => x.PathStepDto.ExpectedCompletionDate)
                .When(x => x.PathStepDto.CompletionDate.HasValue)
                .WithMessage("CompletionDate must be less than or equal to ExpectedCompletionDate.");
        }
    }
}
