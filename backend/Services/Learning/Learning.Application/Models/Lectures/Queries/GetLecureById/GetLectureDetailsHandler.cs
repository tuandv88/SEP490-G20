using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.Quizs.Dtos;

namespace Learning.Application.Models.Lectures.Queries.GetLecureById;
public class GetLectureDetailsHandler(ILectureRepository lectureRepository, IQuizRepository quizRepository, 
    IProblemRepository problemRepository, IUserContextService userContext, ICourseRepository courseRepository) : IQueryHandler<GetLectureDetailQuery, GetLectureDetailsResult> {
    public async Task<GetLectureDetailsResult> Handle(GetLectureDetailQuery request, CancellationToken cancellationToken) {
        var lecture = await lectureRepository.GetLectureByIdDetail(request.LectureId);

        if (lecture == null) {
            throw new NotFoundException("Lecture", request.LectureId);
        }

        // Kiểm tra trạng thái published của khóa học
        var course = await courseRepository.GetCourseByChapterIdAsync(lecture.ChapterId.Value);

        var userRole = userContext.User?.Role;
        var isAdmin = userRole == RoleType.Administrator;
        var isCoursePublished = course!.CourseStatus == CourseStatus.Published;
        if (!isCoursePublished && !isAdmin) {
            throw new UnauthorizedAccessException("Only admins can view unpublished courses.");
        }

        //TODO -- thêm điều kiện phải tham gia khóa học đấy nữa

        QuizDto? quizDto = null;
        ProblemDto? problemDto = null;
        if (lecture.QuizId != null) {
            var quiz = await quizRepository.GetByIdDetailAsync(lecture.QuizId.Value);
            if(quiz != null) {
                quizDto = quiz.ToQuizDto();
            }
        }
        if(lecture.ProblemId != null) {
            var problem = await problemRepository.GetByIdDetailAsync(lecture.ProblemId.Value);
            if(problem != null) {
                problemDto = problem.ToProblemDto(null);
            }
        }

        var lectureDetailDto = lecture.ToLectureDetailDto(problemDto, quizDto);
        return new GetLectureDetailsResult(lectureDetailDto);
    }
}

