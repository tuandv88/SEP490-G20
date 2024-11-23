namespace Learning.Application.Models.Problems.Queries.GetProblemDetails;
public class GetProblemDetailsHandler(IProblemRepository problemRepository)
    : IQueryHandler<GetProblemDetailsQuery, GetProblemDetailsResult> {
    public async Task<GetProblemDetailsResult> Handle(GetProblemDetailsQuery request, CancellationToken cancellationToken) {
        var problem = await problemRepository.GetByIdDetailAsync(request.Id);
        if(problem == null) {
            throw new NotFoundException(nameof(Problem), request.Id);
        }

        return new GetProblemDetailsResult(problem.ToProblemDetailsDto());
    }
}

