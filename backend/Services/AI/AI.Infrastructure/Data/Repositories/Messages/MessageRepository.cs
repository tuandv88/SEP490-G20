using AI.Application.Data;

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

    public async Task<List<Message>> GetMessageByConversationIdsync(Guid conversationId) {
        var messages = await _dbContext.Messages.Include(m => m.References)
                    .AsNoTracking()
                    .AsAsyncEnumerable()
                    .Where(m => m.ConversationId.Value == conversationId)
                    .ToListAsync();
        return messages;
    }
}

