﻿namespace Learning.Application.Models.Problems.Dtos;
public record ProblemListDto(
    Guid ProblemsId,
    string Status,
    string Title,
    string Difficulty,
    double Acceptance,
    bool IsActive
);