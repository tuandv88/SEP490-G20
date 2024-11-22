
namespace Learning.Application.Data.Repositories;
public interface IFileRepository : IRepository<Domain.Models.File> {
    Domain.Models.File GetByVideoLectureId(LectureId id);
}

