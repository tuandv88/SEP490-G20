using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using User.Application.Models.PathSteps.Commands.CreatePathStep;
using User.Application.Models.PathSteps.Dtos;

namespace User.Application.Models.PathSteps.Commands.UpdatePathStep
{
    //[Authorize]
    public record UpdatePathStepCommand(List<UpdatePathStepDto> PathStepDtos) : IRequest<bool>;

    public class UpdatePathStepCommandValidator : AbstractValidator<UpdatePathStepCommand>
    {
        public UpdatePathStepCommandValidator()
        {
            // Validate PathStepDtos (List of PathStepDto)
            RuleForEach(x => x.PathStepDtos)
                .ChildRules(pathStep =>
                {
                    // Validate StepOrder to be greater than 0
                    pathStep.RuleFor(x => x.StepOrder)
                        .GreaterThan(0)
                        .WithMessage("StepOrder must be greater than 0.");

                    // Validate Status to be a valid enum value
                    pathStep.RuleFor(x => x.Status)
                        .IsInEnum()
                        .WithMessage("Status is invalid.");

                    // Validate EnrollmentDate to be not null and less than or equal to ExpectedCompletionDate
                    pathStep.RuleFor(x => x.EnrollmentDate)
                        .NotNull()
                        .WithMessage("EnrollmentDate cannot be null.")
                        .LessThanOrEqualTo(x => x.ExpectedCompletionDate)
                        .WithMessage("EnrollmentDate must be less than or equal to ExpectedCompletionDate.");

                    // Validate CompletionDate if provided to be less than or equal to ExpectedCompletionDate
                    pathStep.RuleFor(x => x.CompletionDate)
                        .LessThanOrEqualTo(x => x.ExpectedCompletionDate)
                        .When(x => x.CompletionDate.HasValue)
                        .WithMessage("CompletionDate must be less than or equal to ExpectedCompletionDate.");
                });
        }
    }
}
