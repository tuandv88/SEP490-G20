using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using User.Application.Models.PathSteps.Commands.CreatePathStep;
using User.Application.Models.PathSteps.Dtos;

namespace User.Application.Models.PathSteps.Commands.UpdatePathStep
{
    [Authorize]
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
                });
        }
    }
}
