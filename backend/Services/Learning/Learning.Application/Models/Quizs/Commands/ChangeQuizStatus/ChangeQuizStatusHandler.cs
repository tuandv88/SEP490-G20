
namespace Learning.Application.Models.Quizs.Commands.ChangeQuizStatus;
public class ChangeQuizStatusHandler(IQuizRepository repository) : ICommandHandler<ChangeQuizStatusCommand, ChangeQuizStatusResult> {
    public async Task<ChangeQuizStatusResult> Handle(ChangeQuizStatusCommand request, CancellationToken cancellationToken) {
        var quiz = await repository.GetByIdAsync(request.Id);
        if (quiz == null) {
            throw new NotFoundException(nameof(Quiz), request.Id);
        }

        quiz.ChangeActive();
        await repository.SaveChangesAsync(cancellationToken);

        return new ChangeQuizStatusResult(true);
    }
}
