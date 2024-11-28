using Learning.Application.Models.Problems.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Problems.Queries.GetSolvedProblems;

public record GetSolvedProblemsQuery : IQuery<GetSolvedProblemsResult>;
public record GetSolvedProblemsResult(SolvedProblemsDto Solved);

