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
        var conversation = await _dbContext.Conversations
                            .FirstOrDefaultAsync(c => c.Id.Equals(ConversationId.Of(id)));
        return conversation;
    }

    public async Task<List<Conversation>> GetConversationByUserIdAsync(Guid userId) {
        var conversations = await _dbContext.Conversations
            .Where(c => c.UserId.Equals(UserId.Of(userId)))
            .ToListAsync();

        return conversations;
    }

    public async Task<Conversation?> GetRecentMessagesAsync(Guid id, int pastMessages) {
        var conversation = await _dbContext.Conversations
                           .AsNoTracking()
                           .FirstOrDefaultAsync(c => c.Id.Equals(ConversationId.Of(id)));

        if (conversation != null) {
            conversation.Messages = await _dbContext.Messages
                .Where(m => m.ConversationId.Equals(conversation.Id))
                .OrderByDescending(m => m.CreatedAt)
                .Take(pastMessages)
                .ToListAsync();
        }

        return conversation;
    }

    public async Task<bool> IsConversationOwnedByUserAsync(Guid userId, Guid conversationId) {
        var exist = await _dbContext.Conversations
            .AnyAsync(c => c.UserId.Equals(UserId.Of(userId)));
        return exist;
    }
}

