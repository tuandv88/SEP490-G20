
namespace Learning.Application.Models.Courses.Commands.ChangeCourseStatus;
public class ChangeCourseStatusHandler(ICourseRepository repository) : ICommandHandler<ChangeCourseStatusCommand, ChangeCourseStatusResult> {
    public async Task<ChangeCourseStatusResult> Handle(ChangeCourseStatusCommand request, CancellationToken cancellationToken) {
        var course = await repository.GetByIdDetailAsync(request.CourseId);
        if (course == null) {
            throw new NotFoundException(nameof(Course), request.CourseId);
        }

        if (!Enum.TryParse(request.CourseStatus, out CourseStatus newStatus)) {
            return new ChangeCourseStatusResult(false, "Invalid course status.");
        }

        if (course.CourseStatus == newStatus) {
            return new ChangeCourseStatusResult(true, "Course status not change");
        }

        if (newStatus == CourseStatus.Scheduled || newStatus == CourseStatus.Published)
        {
            if (course.Chapters.Count < 1) {
                return new ChangeCourseStatusResult(false, "The course must have at least 1 chapters.");
            }

            if (course.Chapters.Any(chapter => chapter.Lectures.Count < 1))
            {
                return new ChangeCourseStatusResult(false, "Each chapter must have at least 1 lectures.");
            }
        }
        if (newStatus == CourseStatus.Scheduled) {
            if (request.ScheduledPublishDate == null || request.ScheduledPublishDate.Value < DateTime.UtcNow) {
                return new ChangeCourseStatusResult(false, "ScheduledPublishDate is not valid.");
            }
            course.UpdateSchedule(request.ScheduledPublishDate.Value);
        }

        course.UpdateStatus(newStatus);

        await repository.UpdateAsync(course);
        await repository.SaveChangesAsync(cancellationToken);

        return new ChangeCourseStatusResult(true, "Course status updated successfully.");
    }

}


