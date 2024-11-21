namespace Learning.Application.Models.Problems.Commands.ChangeProblemStatus;
public class ChangeProblemStatusHandler(IProblemRepository repository) : ICommandHandler<ChangeProblemStatusCommand, ChangeProblemStatusResult> {
    public async Task<ChangeProblemStatusResult> Handle(ChangeProblemStatusCommand request, CancellationToken cancellationToken) {
        var problem = await repository.GetByIdAsync(request.ProblemId);
        if (problem == null)
            throw new NotFoundException(nameof(Problem), request.ProblemId);

        problem.ChangeActive();
        await repository.SaveChangesAsync();

        return new ChangeProblemStatusResult(true);
    }
}
