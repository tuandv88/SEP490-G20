using Learning.Domain.Events;

namespace Learning.Application.Models.Quizs.EventHandler;

public class QuizSubmissionSuccessEventHandler(
    ILectureRepository lectureRepository,
    IUserEnrollmentRepository userEnrollmentRepository,
    ICourseRepository courseRepository) : INotificationHandler<QuizSubmissionSuccessEvent>
{
    public async Task Handle(QuizSubmissionSuccessEvent notification, CancellationToken cancellationToken)
    {
        var quizId = notification.QuizId;
        var status = notification.Status;
        var userId = notification.UserId;
        if (status != QuizSubmissionStatus.Success)
        {
            return;
        }

        var lecture = await lectureRepository.GetByQuizIdAsync(quizId.Value);
        if (lecture is not { LectureType: LectureType.Quiz })
        {
            return;
        }

        // kiểm tra xem lecture thuộc course nào
        var course = await courseRepository.GetAllAsQueryable()
            .FirstOrDefaultAsync(c => c.Chapters.Any(ch =>
                ch.Lectures.Any(l => l.Id.Equals(lecture.Id))
            ), cancellationToken);
        if (course == null)
        {
            return;
        }

        var userEnrollment =
            await userEnrollmentRepository.GetByUserIdAndCourseIdWithProgressAsync(userId.Value, course.Id.Value);

        if (userEnrollment == null)
        {
            return;
        }

        var existingProgress = userEnrollment.LectureProgress.FirstOrDefault(l => l.LectureId.Equals(lecture.Id));
        if (existingProgress == null)
        {
            //set lectureProgress cũ ve false
            var currentProgress = userEnrollment.LectureProgress.FirstOrDefault(l => l.IsCurrent);
            currentProgress?.SetCurrent(false);
            var newProgress = LectureProgress.Create(
                LectureProgressId.Of(Guid.NewGuid()),
                userEnrollment.Id,
                lecture.Id,
                DateTime.UtcNow,
                true,
                duration: 1
            );
            userEnrollment.AddProgress(newProgress);

            var totalLectures = course.Chapters.SelectMany(ch => ch.Lectures).Count();
            var completedLectures = userEnrollment.LectureProgress.Count;
            if (userEnrollment.CompletionDate == null && completedLectures == totalLectures)
            {
                userEnrollment.UpdateStatus(UserEnrollmentStatus.Completed);
                userEnrollment.CompletionDate = DateTime.UtcNow;
            }
            await userEnrollmentRepository.UpdateAsync(userEnrollment);
        }
    }
}