
namespace Learning.Application.Models.Courses.Commands.UpdateLectureProgress;
public class UpdateLectureProgressHandler(IUserEnrollmentRepository repository, IUserContextService userContext, ICourseRepository courseRepository
    ) : ICommandHandler<UpdateLectureProgressCommand, UpdateLectureProgressResult> {
    public async Task<UpdateLectureProgressResult> Handle(UpdateLectureProgressCommand request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;
        var course = await courseRepository.GetByIdDetailAsync(request.CourseId);
        if(course == null) {
            throw new NotFoundException(nameof(Course), request.CourseId);
        }
        var lectureExists = course.Chapters
            .SelectMany(ch => ch.Lectures)
            .Any(lec => lec.Id.Equals(LectureId.Of(request.LectureId)));

        if (!lectureExists) {
            throw new NotFoundException(nameof(Lecture), request.LectureId);
        }


        var userCourse = await repository.GetByUserIdAndCourseIdWithProgressAsync(userId, request.CourseId);
                
        if (userCourse == null) {
            throw new NotFoundException("NotFound usercourse of user");
        }

        var lectureId = LectureId.Of(request.LectureId);
        
        var existingProgress = userCourse.LectureProgress.FirstOrDefault(l => l.LectureId.Equals(lectureId));

        if (existingProgress != null) {
            userCourse.LectureProgress.Remove(existingProgress);
        } else {
            var newProgress = LectureProgress.Create(
                    LectureProgressId.Of(Guid.NewGuid()),
                    userCourse.Id,
                    lectureId,
                    DateTime.UtcNow,
                    true,
                    duration: request.Duration
                    );
            userCourse.AddProgress(newProgress);
        }

        var latestProgress = userCourse.LectureProgress
            .OrderByDescending(p => p.CompletionDate ?? DateTime.MinValue)
            .FirstOrDefault();

        foreach (var progress in userCourse.LectureProgress) {
            progress.IsCurrent = progress == latestProgress;
        }


        await repository.UpdateAsync(userCourse);
        await repository.SaveChangesAsync(cancellationToken);

        return new UpdateLectureProgressResult(true);
    }
}

