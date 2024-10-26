
using Learning.Application.Data.Repositories;
using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.Quizs.Dtos;

namespace Learning.Application.Models.Lectures.Queries.GetLecureById;
public class GetLectureByIdDetailHandler(ILectureRepository lectureRepository, IChapterRepository chapterRepository,
    IQuizRepository quizRepository, IProblemRepository problemRepository
    ) : IQueryHandler<GetLectureByIdDetailQuery, GetLectureByIdDetailResult> {
    public async Task<GetLectureByIdDetailResult> Handle(GetLectureByIdDetailQuery request, CancellationToken cancellationToken) {
        var chapter = await chapterRepository.GetByIdAsync(request.ChapterId);
        if(chapter == null) {
            throw new NotFoundException("Chapter", request.ChapterId);
        }
        var lecture = await lectureRepository.GetLectureByIdDetail(request.LectureId);

        if (lecture == null) {
            throw new NotFoundException("Lecture", request.LectureId);
        }

        if (lecture.ChapterId.Value != request.ChapterId) {
            throw new ConflictException($"The lecture with ID {request.LectureId} is associated with a different chapter.");
        }

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
                problemDto = problem.ToProblemDto();
            }
        }

        var lectureDetailDto = lecture.ToLectureDetailDto(problemDto, quizDto);
        return new GetLectureByIdDetailResult(lectureDetailDto);
    }
}

