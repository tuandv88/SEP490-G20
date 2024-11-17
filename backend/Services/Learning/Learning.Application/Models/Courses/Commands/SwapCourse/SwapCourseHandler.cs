
namespace Learning.Application.Models.Courses.Commands.SwapCourse;
public class SwapCourseHandler(ICourseRepository repository) : ICommandHandler<SwapCourseCommand, SwapCourseResult> {
    public async Task<SwapCourseResult> Handle(SwapCourseCommand request, CancellationToken cancellationToken) {
        var course1 = await repository.GetByIdAsync(request.CourseId1);
        if(course1 == null) {
            throw new NotFoundException("Course", request.CourseId1);
        }
        var course2 = await repository.GetByIdAsync(request.CourseId2);
        if(course2 == null) {
            throw new NotFoundException("Course", request.CourseId2);
        }
        int tmp = course1.OrderIndex;
        course1.UpdateOrderIndex(course2.OrderIndex);
        course2.UpdateOrderIndex(tmp);

        await repository.UpdateAsync(course1);
        await repository.UpdateAsync(course2);
        await repository.SaveChangesAsync(cancellationToken);

        return new SwapCourseResult(course1.OrderIndex, course2.OrderIndex);
    }
}

