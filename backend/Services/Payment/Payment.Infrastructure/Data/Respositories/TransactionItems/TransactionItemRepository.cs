using Payment.Application.Data;
using Payment.Application.Data.Repositories;

namespace Payment.Infrastructure.Data.Respositories.TransactionItems;
public class TransactionItemRepository : Repository<TransactionItem>, ITransactionItemRepository {
    private readonly IApplicationDbContext _dbContext;
    public TransactionItemRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var transactionItem = await GetByIdAsync(id);
        if (transactionItem != null) {
            _dbContext.TransactionItems.Remove(transactionItem);
        }
    }

    public IQueryable<TransactionItem> GetAllAsQueryable() {
        return _dbContext.TransactionItems.AsQueryable();
    }

    public override async Task<TransactionItem?> GetByIdAsync(Guid id) {
        var transactionItem = await _dbContext.TransactionItems
                      .FirstOrDefaultAsync(c => c.Id.Equals(TransactionItemId.Of(id)));
        return transactionItem;
    }
}

