
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
        
        var userEnrollment = await repository.GetByUserIdAndCourseIdWithProgressAsync(userId, request.CourseId);
                
        if (userEnrollment == null) {
            throw new NotFoundException("NotFound UserEnrollment of user");
        }

        var lectureId = LectureId.Of(request.LectureId);
        
        //nếu bài đó đã đánh dấu là hoàn thành thi trả ve true luôn
        var existingProgress = userEnrollment.LectureProgress.FirstOrDefault(l => l.LectureId.Equals(lectureId));

        if (existingProgress != null) {
            return new UpdateLectureProgressResult(true);
        } else {
            //set lectureProgress cũ ve false
            var currentProgress = userEnrollment.LectureProgress.FirstOrDefault(l => l.IsCurrent);
            currentProgress?.SetCurrent(false);
            var newProgress = LectureProgress.Create(
                    LectureProgressId.Of(Guid.NewGuid()),
                    userEnrollment.Id,
                    lectureId,
                    DateTime.UtcNow,
                    true,
                    duration: request.Duration
                    );
            userEnrollment.AddProgress(newProgress);
            
            var totalLectures = course.Chapters.SelectMany(ch => ch.Lectures).Count();
            var completedLectures = userEnrollment.LectureProgress.Count;
            if(userEnrollment.CompletionDate != null && completedLectures == totalLectures) {
                userEnrollment.UpdateStatus(UserEnrollmentStatus.Completed);
                userEnrollment.CompletionDate = DateTime.UtcNow;
            }

            await repository.UpdateAsync(userEnrollment);
            await repository.SaveChangesAsync(cancellationToken);

            return new UpdateLectureProgressResult(true);
        }
    }
}

