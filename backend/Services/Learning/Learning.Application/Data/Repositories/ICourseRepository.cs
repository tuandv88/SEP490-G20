
namespace Learning.Application.Data.Repositories;
public interface ICourseRepository : IRepository<Course> {
    public Task<Course?> GetByIdDetailAsync(Guid id);
}

