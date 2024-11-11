namespace AI.Application.Data.Repositories;
public interface IConversationRepository : IRepository<Conversation>{
    Task<Conversation?> GetRecentMessagesAsync(Guid conversationId);
    Task<List<Conversation>> GetConversationByUserIdAsync(Guid userId);
    Task<bool> IsConversationOwnedByUserAsync(Guid userId, Guid conversationId);
}

