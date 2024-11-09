using AI.Application.Data;
using AI.Application.Data.Repositories;

namespace AI.Infrastructure.Data.Repositories.Messages;
public class MessageRepository : Repository<Message>, IMessageRepository {
    private IApplicationDbContext _dbContext;
    public MessageRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public async override Task DeleteByIdAsync(Guid id) {
        var message = await GetByIdAsync(id);
        if (message != null) {
            _dbContext.Messages.Remove(message);
        }
    }

    public async override Task<Message?> GetByIdAsync(Guid id) {
        var message = _dbContext.Messages
                       .AsEnumerable()
                       .FirstOrDefault(c => c.Id.Value == id);
        return message;
    }
}

