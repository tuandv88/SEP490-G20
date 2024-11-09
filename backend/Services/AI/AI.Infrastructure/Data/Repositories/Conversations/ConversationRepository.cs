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
}

