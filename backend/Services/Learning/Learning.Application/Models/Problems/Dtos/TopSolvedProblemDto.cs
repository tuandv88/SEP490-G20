namespace Learning.Application.Models.Problems.Dtos;
public record TopSolvedProblemDto(
    Guid ProblemId,
    string Title,
    int TotalSubmissions,
    int AcceptedSubmissions,
    float AcceptanceRate
);
