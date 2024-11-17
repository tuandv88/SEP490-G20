namespace Learning.Infrastructure.Data.Repositories.OutboxMessages;
public class OutboxMessageRepository : Repository<OutboxMessage>, IOutboxMessageRepository {
    private readonly IApplicationDbContext _dbContext;
    public OutboxMessageRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var outbox = await GetByIdAsync(id);
        if (outbox != null) {
            _dbContext.OutboxMessages.Remove(outbox);
        }
    }

    public override async Task<OutboxMessage?> GetByIdAsync(Guid id) {
        var outbox = await _dbContext.OutboxMessages
                       .FirstOrDefaultAsync(l => l.Id.Equals(OutboxMessageId.Of(id)));
        return outbox;
    }
}

