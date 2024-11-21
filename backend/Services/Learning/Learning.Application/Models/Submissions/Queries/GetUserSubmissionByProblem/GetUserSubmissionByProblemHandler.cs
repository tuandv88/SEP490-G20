
namespace Learning.Application.Models.Submissions.Queries.GetUserSubmissionByProblem;
public class GetUserSubmissionByProblemHandler(IProblemSubmissionRepository repository) : IQueryHandler<GetUserSubmissionByProblemQuery, GetUserSubmissionByProblemResult> {
    public async Task<GetUserSubmissionByProblemResult> Handle(GetUserSubmissionByProblemQuery request, CancellationToken cancellationToken) {

        throw new NotImplementedException();
    }
}

