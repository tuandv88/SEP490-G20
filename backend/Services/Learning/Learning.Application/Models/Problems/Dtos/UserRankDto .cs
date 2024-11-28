namespace Learning.Application.Models.Problems.Dtos;
public record UserRankDto(
    Guid UserId,
    int SolvedCount
);