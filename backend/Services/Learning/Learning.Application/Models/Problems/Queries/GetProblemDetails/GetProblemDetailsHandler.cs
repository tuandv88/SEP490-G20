namespace Learning.Application.Models.Problems.Queries.GetProblemDetails;
public class GetProblemDetailsHandler(IProblemRepository problemRepository, IUserContextService userContext)
    : IQueryHandler<GetProblemDetailsQuery, GetProblemDetailsResult> {
    public async Task<GetProblemDetailsResult> Handle(GetProblemDetailsQuery request, CancellationToken cancellationToken) {
        var problem = await problemRepository.GetByIdDetailAsync(request.Id);
        if(problem == null) {
            throw new NotFoundException(nameof(Problem), request.Id);
        }

        //problem phải được active đối với người dùng cơ bản
        var userRole = userContext.User?.Role;
        var isAdmin = userRole == PoliciesType.Administrator;

        if (!isAdmin && !problem.IsActive) {
            throw new NotFoundException(nameof(Problem), request.Id);
        }
        return new GetProblemDetailsResult(problem.ToProblemDetailsDto());

    }
}

