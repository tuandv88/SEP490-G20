
namespace Learning.Application.Models.Courses.Commands.ChangeCourseLevel;
public class ChangeCourseLevelHandler(ICourseRepository repository) : ICommandHandler<ChangeCourseLevelCommand, ChangeCourseLevelResult> {
    public async Task<ChangeCourseLevelResult> Handle(ChangeCourseLevelCommand request, CancellationToken cancellationToken) {
        var course = await repository.GetByIdAsync(request.CourseId);
        if (course == null) {
            throw new NotFoundException(nameof(Course), request.CourseId);
        }

        var oldLevel = course.CourseLevel;
        Enum.TryParse(request.CourseLevel, out CourseLevel newLevel);
        // Nếu CourseLevel không thay đổi, bỏ qua
        if (oldLevel == newLevel) {
            return new ChangeCourseLevelResult(false, "Course level is already set to the specified value.");
        }
         
        //Cập nhật lại course level và đẩy orderIndex lên cao nhất
        course.UpdateCourseLevel(newLevel, (await repository.CountByLevelAsync(newLevel))+1);
        await repository.UpdateAsync(course);

        //Cập nhật lại các course cùng phân cấp course level của course trước khi thay đổi
        var oldCoursesByLevel = await repository.GetByCourseLevelAsync(oldLevel);

        for (int i = 0; i< oldCoursesByLevel.Count; i++) {
            oldCoursesByLevel[i].UpdateOrderIndex(i + 1);
        }
        repository.Update(oldCoursesByLevel.ToArray());

        await repository.SaveChangesAsync();
        return new ChangeCourseLevelResult(true, "Course level and order index updated successfully.");
    }
}

