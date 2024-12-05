using Payment.Domain.Models;

namespace Payment.Application.Data.Repositories;
public interface ITransactionLogRepository : IRepository<TransactionLog>{
    Task AddLog(Guid transactionId, string action, string status, string description);
}

