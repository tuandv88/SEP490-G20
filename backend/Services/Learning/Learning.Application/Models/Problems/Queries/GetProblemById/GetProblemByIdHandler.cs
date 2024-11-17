
namespace Learning.Application.Models.Problems.Queries.GetProblemById;
public class GetProblemByIdHandler(IProblemRepository repository) : IQueryHandler<GetProblemByIdQuery, GetProblemByIdResult> {
    public async Task<GetProblemByIdResult> Handle(GetProblemByIdQuery request, CancellationToken cancellationToken) {
        var problem = await repository.GetByIdDetailAsync(request.Id);
        if(problem == null) {
            throw new NotFoundException("Problem", request.Id);
        }
        return new GetProblemByIdResult(problem.ToProblemDto(false));
    }
}

