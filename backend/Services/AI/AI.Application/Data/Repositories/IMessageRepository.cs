namespace AI.Application.Data.Repositories;
public interface IMessageRepository : IRepository<Message>{
    Task<List<Message>> GetMessageByConversationIdsync(Guid conversationId);
}

