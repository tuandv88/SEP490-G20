
using Learning.Application.Models.Problems.Dtos;

namespace Learning.Application.Models.Problems.Queries.GetSolvedProblems;
public class GetSolvedProblemsHandler(IUserContextService userContext, IProblemRepository repository) : IQueryHandler<GetSolvedProblemsQuery, GetSolvedProblemsResult> {
    public async Task<GetSolvedProblemsResult> Handle(GetSolvedProblemsQuery request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;
        if (userId.Equals(Guid.Empty)) {
            return new GetSolvedProblemsResult(null);
        }
        var totalProblemsByDifficulty = await repository.GetTotalProblemsByDifficultyAsync();

        var solvedProblemsByDifficulty = await repository.GetSolvedProblemsByUserAsync(userId);

        var easy = new SolvedDifficulty(
            solvedProblemsByDifficulty.ContainsKey(DifficultyType.Easy) ? solvedProblemsByDifficulty[DifficultyType.Easy] : 0,
            totalProblemsByDifficulty.ContainsKey(DifficultyType.Easy) ? totalProblemsByDifficulty[DifficultyType.Easy] : 0
        );

        var medium = new SolvedDifficulty(
            solvedProblemsByDifficulty.ContainsKey(DifficultyType.Medium) ? solvedProblemsByDifficulty[DifficultyType.Medium] : 0,
            totalProblemsByDifficulty.ContainsKey(DifficultyType.Medium) ? totalProblemsByDifficulty[DifficultyType.Medium] : 0
        );

        var hard = new SolvedDifficulty(
            solvedProblemsByDifficulty.ContainsKey(DifficultyType.Hard) ? solvedProblemsByDifficulty[DifficultyType.Hard] : 0,
            totalProblemsByDifficulty.ContainsKey(DifficultyType.Hard) ? totalProblemsByDifficulty[DifficultyType.Hard] : 0
        );

        return new GetSolvedProblemsResult(
            new SolvedProblemsDto(easy, medium, hard)
        );
    }
}

