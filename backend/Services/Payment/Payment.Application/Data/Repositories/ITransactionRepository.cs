using Payment.Domain.Models;

namespace Payment.Application.Data.Repositories;
public interface ITransactionRepository : IRepository<Transaction>{
    Task<Transaction> GetByExternalOrderId(string orderId);
    Task<Transaction> GetByIdIncludeItems(Guid Id);
}

