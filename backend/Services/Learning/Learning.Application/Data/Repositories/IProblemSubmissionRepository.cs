namespace Learning.Application.Data.Repositories;
public interface IProblemSubmissionRepository : IRepository<ProblemSubmission>{
    Task<List<ProblemSubmission>> GetProblemSubmissionsByProblemAsync(params ProblemId[] problems);
}

