
namespace Learning.Application.Models.Problems.Commands.DeleteProblem;
public class DeleteProblemHandler(IProblemRepository repository) : ICommandHandler<DeleteProblemCommand, Unit> {
    public async Task<Unit> Handle(DeleteProblemCommand request, CancellationToken cancellationToken) {
        var problem =await repository.GetByIdAsync(request.Id);
        if (problem == null) {
            throw new NotFoundException(nameof(Problem), request.Id);
        }
        await repository.DeleteAsync(problem);
        await repository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}

