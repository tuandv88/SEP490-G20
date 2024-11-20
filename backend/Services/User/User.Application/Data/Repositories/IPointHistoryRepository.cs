using User.Domain.Models;

namespace User.Application.Data.Repositories
{
    public  interface IPointHistoryRepository :IRepository<PointHistory>
    {
        Task<List<PointHistory>> GetPointHistoryByUserIdAsync(Guid userId);
    }
}
