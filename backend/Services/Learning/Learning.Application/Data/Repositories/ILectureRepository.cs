namespace Learning.Application.Data.Repositories;
public interface ILectureRepository : IRepository<Lecture>{
    Task<Lecture?> GetLectureByIdDetail(Guid Id);
    Task<int> CountByChapterAsync(Guid chapterId);
    Task DeleteAsync(params Lecture[] lectures);
    Task<Lecture?> GetByQuizIdAsync(Guid quizId);
    Task<Lecture?> GetByProblemIdAsync(Guid problemId);
}

