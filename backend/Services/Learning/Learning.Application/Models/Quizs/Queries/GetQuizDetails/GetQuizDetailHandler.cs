using Learning.Application.Extensions;
using Learning.Application.Models.Quizs.Dtos;
using Learning.Application.Models.Quizs.Dtos.SubmissionDto;
using Learning.Application.Models.Submissions.Dtos;

namespace Learning.Application.Models.Quizs.Queries.GetQuizDetails;
public class GetQuizDetailHandler(IQuizRepository repository, IQuizSubmissionRepository quizSubmissionRepository, 
    IUserContextService userContext) : IQueryHandler<GetQuizDetailQuery, GetQuizDetailResult> {
    public async Task<GetQuizDetailResult> Handle(GetQuizDetailQuery request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;

        var quiz = await repository.GetByIdDetailAsync(request.Id);
        if (quiz == null || !quiz.IsActive) {
            throw new NotFoundException("Quiz", request.Id);
        }

        // Kiểm tra quiz có đang được làm bởi người dùng không (trạng thái InProgress)
        var activeSubmission = await quizSubmissionRepository.GetSubmissionInProgressAsync(request.Id, userId);
        if(activeSubmission == null) {
            throw new InvalidOperationException("Quiz is not start");
        }
        var questionAnswers = activeSubmission.Answers?.Select(a => new QuestionAnswerDto(
            Guid.Parse(a.Id),
            a.UserAnswers?.Select(Guid.Parse).ToList(),
            Problem: a.Problem != null ? new QuestionProblemDto(Guid.Parse(a.Problem.Id), new SubmissionCodeDto(
                    a.Problem.CodeAnswer!.LanguageCode,
                    a.Problem.CodeAnswer!.SolutionCode
                )) : null)).ToList();

        //quiz phải được active đối với người dùng cơ bản
        var userRole = userContext.User?.Role;
        var isAdmin = userRole == PoliciesType.Administrator;

        if (!isAdmin && !quiz.IsActive) {
            throw new NotFoundException(nameof(Quiz), request.Id);
        }
        return new GetQuizDetailResult(quiz.ToQuizDetailDto(), new QuizAnswerDto(activeSubmission.Id.Value, activeSubmission.StartTime, questionAnswers));
    }
}

