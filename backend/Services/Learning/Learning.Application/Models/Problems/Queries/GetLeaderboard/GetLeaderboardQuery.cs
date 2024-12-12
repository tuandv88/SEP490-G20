using Learning.Application.Models.Problems.Dtos;

namespace Learning.Application.Models.Problems.Queries.GetLeaderboard;
public record GetLeaderboardQuery(PaginationRequest PaginationRequest, GetLeaderboardFilter Filter) : IQuery<GetLeaderboardResult>;
public record GetLeaderboardResult(PaginatedResult<UserRankDto> Ranks);
public record GetLeaderboardFilter(DateTime? StartDate, DateTime? EndDate);