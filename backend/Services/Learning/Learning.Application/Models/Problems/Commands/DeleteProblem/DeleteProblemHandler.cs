
namespace Learning.Application.Models.Problems.Commands.DeleteProblem;
public class DeleteProblemHandler(IProblemRepository repository, ILectureRepository lectureRepository) : ICommandHandler<DeleteProblemCommand, Unit> {
    public async Task<Unit> Handle(DeleteProblemCommand request, CancellationToken cancellationToken) {
        var problem = await repository.GetByIdAsync(request.Id);
        if (problem == null) {
            throw new NotFoundException(nameof(Problem), request.Id);
        }
        var lecture = await lectureRepository.GetByProblemIdAsync(problem.Id.Value);
        if (lecture != null) {
            lecture.ProblemId = null;
            await lectureRepository.UpdateAsync(lecture);
        }
        await repository.DeleteAsync(problem);
        await repository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}

