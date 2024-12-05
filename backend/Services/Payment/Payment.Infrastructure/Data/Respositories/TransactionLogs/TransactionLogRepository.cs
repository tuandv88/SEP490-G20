using Payment.Application.Data;
using Payment.Application.Data.Repositories;

namespace Payment.Infrastructure.Data.Respositories.TransactionLogs;
public class TransactionLogRepository : Repository<TransactionLog>, ITransactionLogRepository {
    private readonly IApplicationDbContext _dbContext;
    public TransactionLogRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public async Task AddLog(Guid transactionId, string action, string status, string description) {
        var transaction = _dbContext.Transactions.FirstOrDefault(t => t.Id.Equals(TransactionId.Of(transactionId)));
        if(transaction != null) {
            await _dbContext.AddAsync(new TransactionLog() {
                Id = TransactionLogId.Of(Guid.NewGuid()),
                TransactionId = TransactionId.Of(transactionId),
                Action = action, Status = status,
                Description = description
            });
            await _dbContext.SaveChangesAsync();
        }
    }

    public async override Task DeleteByIdAsync(Guid id) {
        var transactionLog = await GetByIdAsync(id);
        if (transactionLog != null) {
            _dbContext.TransactionLogs.Remove(transactionLog);
        }
    }

    public async override Task<TransactionLog?> GetByIdAsync(Guid id) {
        var transactionLog = await _dbContext.TransactionLogs
                      .FirstOrDefaultAsync(c => c.Id.Equals(TransactionLogId.Of(id)));
        return transactionLog;
    }
}

