
namespace Learning.Application.Data.Repositories;
public interface IFileRepository : IRepository<Domain.Models.File> {
    Domain.Models.File GetVideoByLectureId(LectureId id);
    List<Domain.Models.File> GetDocumentByLectureId(LectureId id);
}

