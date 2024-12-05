using Payment.Application.Data;
using Payment.Application.Data.Repositories;

namespace Payment.Infrastructure.Data.Respositories.Transactions;
public class TransactionRepository : Repository<Transaction>, ITransactionRepository {
    private readonly IApplicationDbContext _dbContext;
    public TransactionRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public async override Task DeleteByIdAsync(Guid id) {
        var transaction = await GetByIdAsync(id);
        if (transaction != null) {
            _dbContext.Transactions.Remove(transaction);
        }
    }

    public async Task<Transaction> GetByExternalOrderId(string orderId) {
        var transaction = await _dbContext.Transactions.FirstOrDefaultAsync(t => t.ExternalOrderId.Equals(orderId));
        return transaction;
    }

    public async override Task<Transaction?> GetByIdAsync(Guid id) {
        var transaction = await _dbContext.Transactions.Include(t => t.Items)
                       .FirstOrDefaultAsync(c => c.Id.Equals(TransactionId.Of(id)));
        return transaction;
    }

    public async Task<Transaction> GetByIdIncludeItems(Guid Id) {
        var transaction = await _dbContext.Transactions
                      .FirstOrDefaultAsync(c => c.Id.Equals(TransactionId.Of(Id)));
        return transaction;
    }
}

