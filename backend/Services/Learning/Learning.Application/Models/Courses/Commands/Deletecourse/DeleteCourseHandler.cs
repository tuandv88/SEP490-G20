namespace Learning.Application.Models.Courses.Commands.Deletecourse;
public class DeleteCourseHandler(ICourseRepository courseRepository) : ICommandHandler<DeleteCourseCommand, Unit> {
    public async Task<Unit> Handle(DeleteCourseCommand request, CancellationToken cancellationToken) {
        var course = await courseRepository.GetByIdDetailAsync(request.CourseId);
        if (course == null) {
            throw new NotFoundException(nameof(Course), request.CourseId);
        }
        throw new NotImplementedException();
    }
}

