namespace Learning.Application.Data.Repositories;
public interface ILectureRepository : IRepository<Lecture>{
    Task<Lecture?> GetLectureByIdDetail(Guid Id);
}

