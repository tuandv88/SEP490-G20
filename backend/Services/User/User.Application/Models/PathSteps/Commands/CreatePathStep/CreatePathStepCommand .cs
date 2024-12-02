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
        }
    }

}
