using AI.Application.Data;
using AI.Application.Data.Repositories;

namespace AI.Infrastructure.Data.Repositories.Recommendations;
public class RecommendationRepository : Repository<Recommendation>, IRecommendationRepository {
    private IApplicationDbContext _dbContext;
    public RecommendationRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public async override Task DeleteByIdAsync(Guid id) {
        var recommendation = await GetByIdAsync(id);
        if (recommendation != null) {
            _dbContext.Recommendations.Remove(recommendation);
        }
    }

    public async override Task<Recommendation?> GetByIdAsync(Guid id) {
        var recommendation = _dbContext.Recommendations
                       .AsEnumerable()
                       .FirstOrDefault(c => c.Id.Value == id);
        return recommendation;
    }
}

