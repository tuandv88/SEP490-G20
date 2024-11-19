
namespace Learning.Application.Models.Quizs.Queries.GetFullQuizDetails;
public class GetFullQuizDetailsHandler(IQuizRepository repository) : IQueryHandler<GetFullQuizDetailsQuery, GetFullQuizDetailsResult> {
    public async Task<GetFullQuizDetailsResult> Handle(GetFullQuizDetailsQuery request, CancellationToken cancellationToken) {
        var quiz = await repository.GetByIdDetailAsync(request.Id);
        if(quiz == null) {
            throw new NotFoundException(nameof(Quiz), request.Id);
        }
        return new GetFullQuizDetailsResult(quiz.ToFullQuizDto());
    }
}

