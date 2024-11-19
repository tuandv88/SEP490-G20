namespace Learning.Application.Models.Problems.Queries.GetProblemById;
public class GetProblemByIdHandler(IProblemRepository repository, IUserContextService userContext) : IQueryHandler<GetProblemByIdQuery, GetProblemByIdResult> {
    public async Task<GetProblemByIdResult> Handle(GetProblemByIdQuery request, CancellationToken cancellationToken) {

        var problem = await repository.GetByIdDetailAsync(request.Id);
        if(problem == null) {
            throw new NotFoundException(nameof(Problem), request.Id);
        }

        //problem phải được active đối với người dùng cơ bản
        var userRole = userContext.User?.Role;
        var isAdmin = userRole == PoliciesType.Administrator;

        if (!isAdmin && !problem.IsActive) {
            throw new NotFoundException(nameof(Problem), request.Id);
        }

        return new GetProblemByIdResult(problem.ToProblemDto(false));
    }
}

