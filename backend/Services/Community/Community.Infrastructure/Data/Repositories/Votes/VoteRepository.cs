namespace Community.Infrastructure.Data.Repositories.Votes;
public class VoteRepository : Repository<Vote>, IVoteRepository
{
    private readonly IApplicationDbContext _dbContext;
    public VoteRepository(IApplicationDbContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException();
    }

    public override async Task DeleteByIdAsync(Guid id)
    {
        var vote = await GetByIdAsync(id);
        if (vote != null)
        {
            _dbContext.Votes.Remove(vote);
        }
    }

    public override async Task<Vote?> GetByIdAsync(Guid id)
    {
        var vote = _dbContext.Votes
                        .AsEnumerable()
                        .FirstOrDefault(c => c.Id.Value == id);
        return vote;
    }

    public async Task<Vote?> GetByIdDetailAsync(Guid id)
    {
        return null;
    }

    public async Task<IQueryable<Vote>> GetVotesByCommentIdAsync(Guid commentId)
    {
        var votes = _dbContext.Votes
            .AsEnumerable()
            .Where(v => v.CommentId != null && v.CommentId.Value == commentId) 
            .AsQueryable();

        return await Task.FromResult(votes);
    }

}



