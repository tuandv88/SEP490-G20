using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.Quizs.Dtos;

namespace Learning.Application.Models.Lectures.Queries.GetLecureById;
public class GetLectureDetailsHandler(ILectureRepository lectureRepository, IQuizRepository quizRepository, 
    IProblemRepository problemRepository, IUserContextService userContext, ICourseRepository courseRepository,
    IQuizSubmissionRepository quizSubmissionRepository, IUserEnrollmentRepository userCourseRepository
    ) : IQueryHandler<GetLectureDetailQuery, GetLectureDetailsResult> {
    public async Task<GetLectureDetailsResult> Handle(GetLectureDetailQuery request, CancellationToken cancellationToken) {
        var lecture = await lectureRepository.GetLectureByIdDetail(request.LectureId);

        if (lecture == null) {
            throw new NotFoundException("Lecture", request.LectureId);
        }

        // Kiểm tra trạng thái published của khóa học
        var course = await courseRepository.GetCourseByChapterIdAsync(lecture.ChapterId.Value);

        var userRole = userContext.User.Role;
        var isAdmin = userRole == PoliciesType.Administrator;
        var isCoursePublished = course!.CourseStatus == CourseStatus.Published;
        if (!isCoursePublished && !isAdmin) {
            throw new UnauthorizedAccessException("Only admins can view unpublished courses.");
        }

        //TODO -- thêm điều kiện phải tham gia khóa học đấy nữa
        if (!isAdmin) {
            var userId = userContext.User.Id;
            var userCourse = await userCourseRepository.GetByUserIdAndCourseIdWithProgressAsync(userId, course.Id.Value);
            if (userCourse == null) {
                throw new ForbiddenAccessException();
            }
        }

        QuizDto? quizDto = null;
        ProblemDto? problemDto = null;
        if (lecture.QuizId != null) {
            var quiz = await quizRepository.GetByIdAsync(lecture.QuizId.Value);
            if (quiz != null) {
                var userId = userContext.User?.Id;
                var attemptCount = userId != null && userId!= Guid.Empty? await quizSubmissionRepository.CountByQuizAndUser(quiz.Id.Value, userId.Value) : 0;
                quizDto = quiz.ToQuizDto(attemptCount);
            }
        }
        if(lecture.ProblemId != null) {
            var problem = await problemRepository.GetByIdDetailAsync(lecture.ProblemId.Value);
            if(problem != null) {
                problemDto = problem.ToProblemDto(false);
            }
        }

        var lectureDetailDto = lecture.ToLectureDetailDto(problemDto, quizDto);
        return new GetLectureDetailsResult(lectureDetailDto);
    }
}

