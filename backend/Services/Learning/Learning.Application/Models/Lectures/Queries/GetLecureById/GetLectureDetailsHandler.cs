using Learning.Application.Data.Repositories;
using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.Quizs.Dtos;

namespace Learning.Application.Models.Lectures.Queries.GetLecureById;
public class GetLectureDetailsHandler(ILectureRepository lectureRepository, IQuizRepository quizRepository, 
    IProblemRepository problemRepository) : IQueryHandler<GetLectureDetailQuery, GetLectureDetailsResult> {
    public async Task<GetLectureDetailsResult> Handle(GetLectureDetailQuery request, CancellationToken cancellationToken) {
        var lecture = await lectureRepository.GetLectureByIdDetail(request.LectureId);

        if (lecture == null) {
            throw new NotFoundException("Lecture", request.LectureId);
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
                problemDto = problem.ToProblemDto(null);
            }
        }

        var lectureDetailDto = lecture.ToLectureDetailDto(problemDto, quizDto);
        return new GetLectureDetailsResult(lectureDetailDto);
    }
}

