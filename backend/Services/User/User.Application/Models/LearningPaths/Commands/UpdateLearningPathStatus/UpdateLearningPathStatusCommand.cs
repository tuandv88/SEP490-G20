using MediatR;
using User.Domain.Enums;

namespace User.Application.Models.LearningPaths.Commands.UpdateLearningPathStatus
{
    public record UpdateLearningPathStatusCommand(Guid Id, LearningPathStatus Status) : IRequest<bool>;
}
