
using Learning.Application.Data.Repositories;

namespace Learning.Application.Models.Quizs.Queries.GetQuizDetails;
public class GetQuizDetailHandler(IQuizRepository repository) : IQueryHandler<GetQuizDetailQuery, GetQuizDetailResult> {
    public async Task<GetQuizDetailResult> Handle(GetQuizDetailQuery request, CancellationToken cancellationToken) {
        var quiz = await repository.GetByIdDetailAsync(request.Id);
        if(quiz == null) {
            throw new NotFoundException("Quiz", request.Id);
        }

        return new GetQuizDetailResult(quiz.ToQuizDto());
    }
}

