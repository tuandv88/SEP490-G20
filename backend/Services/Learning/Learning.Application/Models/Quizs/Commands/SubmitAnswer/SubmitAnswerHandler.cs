
using Judge0.DotNet.Exceptions;
using NotFoundException = BuildingBlocks.Exceptions.NotFoundException;

namespace Learning.Application.Models.Quizs.Commands.SubmitAnswer;
public class SubmitAnswerHandler(IQuizSubmissionRepository repository, IUserContextService userContext, 
    IQuestionRepository questionRepository) : ICommandHandler<SubmitAnswerCommand, SubmitAnswerResult> {
    public async Task<SubmitAnswerResult> Handle(SubmitAnswerCommand request, CancellationToken cancellationToken) {

        var userId = userContext.User.Id;
        var quizSubmission = await repository.GetByIdAsync(request.QuizSubmissionId);

        if(quizSubmission == null) {
            throw new NotFoundException(nameof(QuizSubmission), request.QuizSubmissionId);
        }
        if(quizSubmission.UserId.Value != userId) {
            throw new ForbiddenException();
        }
        if (quizSubmission.Status != QuizSubmissionStatus.InProgress) {
            throw new InvalidOperationException("The test is not running");
        }
        var question = await questionRepository.GetByIdAndQuizId(quizSubmission.QuizId, QuestionId.Of(request.Question.QuestionId));

        if(question == null) {
            throw new NotFoundException(nameof(Question), request.Question.QuestionId);
        }
        if (request.Question.Problem?.ProblemId != question.ProblemId?.Value) {
            throw new ConflictException("The problemId in the question and the problemId posted do not match.");
        }

        // Tạo câu trả lời
        QuestionAnswer answer = question.ProblemId == null
            ? CreateAnswerWithoutProblem(question, request)
            : CreateAnswerWithProblem(question, request);

        quizSubmission.UpdateAnswers(answer);

        await repository.UpdateAsync(quizSubmission);
        await repository.SaveChangesAsync(cancellationToken);

        return new SubmitAnswerResult(true);
    }

    private QuestionAnswer CreateAnswerWithoutProblem(Question question, SubmitAnswerCommand request) {
        return new QuestionAnswer {
            Id = question.Id.Value.ToString(),
            Content = question.Content,
            Choices = question.QuestionOptions.Select(q => new Choice {
                Id = q.Id.Value.ToString(),
                Content = q.Content,
                IsCorrect = q.IsCorrect,
                OrderIndex = q.OrderIndex
            }).ToList(),
            UserAnswers = request.Question.QuestionAnswerId?.Select(q => q.ToString()).ToList() ?? new List<string>()
        };
    }

    private QuestionAnswer CreateAnswerWithProblem(Question question, SubmitAnswerCommand request) {
        var problem = request.Question.Problem;
        return new QuestionAnswer {
            Id = question.Id.Value.ToString(),
            Content = question.Content,
            Problem = new ProblemAnswer {
                Id = problem!.ProblemId.ToString(),
                CodeAnswer = new CodeAnswer {
                    LanguageCode = problem.Submission.LanguageCode,
                    SolutionCode = problem.Submission.SolutionCode
                }
            }
        };
    }
}

