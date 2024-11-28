using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Commands.UpdateCourse;

public class UpdateCourseHandler(ICourseRepository repository) : ICommandHandler<UpdateCourseCommand, UpdateCourseResult> {
    public async Task<UpdateCourseResult> Handle(UpdateCourseCommand request, CancellationToken cancellationToken) {

        var course = await repository.GetByIdAsync(request.CourseId);

        if (course == null) {
            throw new NotFoundException("Course", request.CourseId);

        }
        UpdateCourseWithNewValues(course, request.UpdateCourseDto);
        await repository.UpdateAsync(course);
        await repository.SaveChangesAsync(cancellationToken);

        return new UpdateCourseResult(true);
    }
    private void UpdateCourseWithNewValues(Course course, UpdateCourseDto updateCourseDto) {
        course.Update(
            title: updateCourseDto.Title,
            description: updateCourseDto.Description,
            headline: updateCourseDto.Headline,
            prerequisites: updateCourseDto.Prerequisites,
            objectives: updateCourseDto.Objectives,
            targetAudiences: updateCourseDto.TargetAudiences,
            price: updateCourseDto.Price
        );
    }
}

