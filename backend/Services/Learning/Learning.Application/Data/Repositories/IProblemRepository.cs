using Learning.Application.Models.Problems.Dtos;

namespace Learning.Application.Data.Repositories;
public interface IProblemRepository : IRepository<Problem>{
    Task<Problem?> GetByIdDetailAsync(Guid id);
    Task<IQueryable<Problem>> GetAllAsQueryableAsync();
    Task<Dictionary<DifficultyType, int>> GetTotalProblemsByDifficultyAsync();
    Task<Dictionary<DifficultyType, int>> GetSolvedProblemsByUserAsync(Guid userId);
}

