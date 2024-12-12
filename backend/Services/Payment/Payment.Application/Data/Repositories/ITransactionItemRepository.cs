using Payment.Domain.Models;
using Payment.Domain.ValueObjects;

namespace Payment.Application.Data.Repositories;
public interface ITransactionItemRepository: IRepository<TransactionItem> {
    IQueryable<TransactionItem> GetAllAsQueryable();
    
}
