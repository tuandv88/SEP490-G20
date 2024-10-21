

namespace Learning.Infrastructure.Data.Repositories.Videos;
public class VideoRepository : Repository<Video>, IVideoRepository {
    private IApplicationDbContext _dbContext;
    public VideoRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var video = await GetByIdAsync(id);
        if (video != null) {
            _dbContext.Videos.Remove(video);
        }
    }

    public override async Task<Video?> GetByIdAsync(Guid id) {
        var video = _dbContext.Videos
                        .AsEnumerable()
                        .FirstOrDefault(c => c.Id.Value == id);
        return video;
    }
}

