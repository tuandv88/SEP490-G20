using AI.Application.Data;
using AI.Application.Data.Repositories;

namespace AI.Infrastructure.Data.Repositories.Conversations;
public class ConversationRepository : Repository<Conversation>, IConversationRepository {
    private IApplicationDbContext _dbContext;
    public ConversationRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public async override Task DeleteByIdAsync(Guid id) {
        var conversation = await GetByIdAsync(id);
        if (conversation != null) {
            _dbContext.Conversations.Remove(conversation);
        }
    }

    public async override Task<Conversation?> GetByIdAsync(Guid id) {
        var conversation = _dbContext.Conversations
                       .AsEnumerable()
                       .FirstOrDefault(c => c.Id.Value == id);
        return conversation;
    }

    public async Task<List<Conversation>> GetConversationByUserIdAsync(Guid userId) {
        var conversations = await _dbContext.Conversations
            .AsAsyncEnumerable()
            .Where(c => c.UserId.Value == userId)
            .ToListAsync();

        return conversations;
    }

    public async Task<Conversation?> GetRecentMessagesAsync(Guid id) {
        var conversation = _dbContext.Conversations
                       .Include(c => c.Messages)
                       .AsNoTracking()
                       .AsEnumerable()
                       .FirstOrDefault(c => c.Id.Value == id);

        if (conversation != null) {
            conversation.Messages = conversation.Messages
                .Where(m => m.ConversationId.Value == id)
                .OrderByDescending(m => m.CreatedAt)
                .Take(10)
                .ToList();
        }
        return conversation;
    }

    public async Task<bool> IsConversationOwnedByUserAsync(Guid userId, Guid conversationId) {
        var exist = await _dbContext.Conversations
            .AsAsyncEnumerable()
            .AnyAsync(c => c.UserId.Value == userId);
        return exist;
    }
}

