using Community.Domain.Models;
using System;
namespace Community.Infrastructure.Data.Repositories.Comments;
public class CommentRepository : Repository<Comment>, ICommentRepository
{
    private readonly IApplicationDbContext _dbContext;
    public CommentRepository(IApplicationDbContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException();
    }

    public async Task<List<Comment>?> GetAllCommentDetailsAsync()
    {

        var comments = await _dbContext.Comments.Include(c => c.Votes).ThenInclude(v => v.Discussion).ToListAsync();

        return comments;
    }

    public override async Task DeleteByIdAsync(Guid id)
    {
        var comment = await GetByIdAsync(id);
        if (comment != null)
        {
            _dbContext.Comments.Remove(comment);
        }
    }

    public override async Task<Comment?> GetByIdAsync(Guid id)
    {
        var comment = _dbContext.Comments
                        .AsEnumerable()
                        .FirstOrDefault(c => c.Id.Value == id);
        return comment;
    }

    public async Task<Comment?> GetByIdDetailAsync(Guid id)
    {
        return null;
    }
}

