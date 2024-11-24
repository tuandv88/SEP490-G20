



namespace Learning.Infrastructure.Data.Repositories.Files;
public class FileRepository : Repository<Domain.Models.File>, IFileRepository {
    private IApplicationDbContext _dbContext;
    public FileRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var file = await GetByIdAsync(id);
        if (file != null) {
            _dbContext.Files.Remove(file);
        }
    }

    public override async Task<Domain.Models.File?> GetByIdAsync(Guid id) {
        var file = await _dbContext.Files
                        .FirstOrDefaultAsync(c => c.Id.Equals(FileId.Of(id)));
        return file;
    }

    public List<Domain.Models.File> GetDocumentByLectureId(LectureId id) {
        var files = _dbContext.Files.
                    Where(c => c.LectureId.Equals(id) && c.FileType == FileType.DOCUMENT).ToList();
        return files;

    }

    public Domain.Models.File GetVideoByLectureId(LectureId id) {
        var file = _dbContext.Files.
                    FirstOrDefault(c => c.LectureId.Equals(id) && c.FileType == FileType.VIDEO);

        return file;
    }
}

