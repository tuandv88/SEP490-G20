namespace Learning.Application.Models.Problems.Dtos;
public record SolvedProblemsDto(
    SolvedDifficulty Easy,
    SolvedDifficulty Medium,
    SolvedDifficulty Hard
);
public record SolvedDifficulty(
    int SolvedCount,
    int TotalCount
);