using BuildingBlocks.CQRS;
using User.Application.Models.PathSteps.Dtos;

namespace User.Application.Models.PathSteps.Commands.CreatePathStep
{
    public record CreatePathStepCommand : ICommand<CreatePathStepResult>
    {
        public required Guid UserId { get; set; }
        public required PathStepDto PathStepDto { get; set; }
    }

    public record CreatePathStepResult(Guid Id);

}
