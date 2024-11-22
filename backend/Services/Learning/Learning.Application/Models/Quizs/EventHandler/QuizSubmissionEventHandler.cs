using BuildingBlocks.Messaging.Events.Learnings;
using Learning.Application.Models.Submissions.Commands.CreateCodeExecute;
using Learning.Application.Models.Submissions.Dtos;
using Learning.Application.Models.TestCases.Dtos;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace Learning.Application.Models.Quizs.EventHandler;
public class QuizSubmissionEventHandler(IQuizSubmissionRepository quizSubmissionRepository, ISender sender, IProblemRepository problemRepository,
    IQuizRepository quizRepository, ILogger<QuizSubmissionEventHandler> logger) : IConsumer<QuizSubmissionEvent> {
    public async Task Consume(ConsumeContext<QuizSubmissionEvent> context) {

        //xử lí bài nộp ở đây
        var quizSubmission = await quizSubmissionRepository.GetByIdAsync(context.Message.SubmissionId);
        if (quizSubmission == null) {
            logger.LogWarning($"Submission is not found submissionId : {context.Message.SubmissionId}");
            return;
        } 
        if (quizSubmission.Status == QuizSubmissionStatus.Processing) {
            var quiz = await quizRepository.GetByIdDetailAsync(quizSubmission.QuizId.Value);

            if (quizSubmission.Answers == null) {
                UpdateSubmissionWithoutAnswers(quizSubmission, quiz!);
            } else {
                await UpdateSubmissionWithAnswers(quizSubmission, quiz!);
            }
            quizSubmission.UpdateStatus(QuizSubmissionStatus.Success);
            await quizSubmissionRepository.UpdateAsync(quizSubmission);
            await quizSubmissionRepository.SaveChangesAsync();
        }
        return;
    }
    private void UpdateSubmissionWithoutAnswers(QuizSubmission quizSubmission, Quiz quiz) {
        quizSubmission.UpdateSubmitResult(0, quiz.Questions.Sum(q => q.Mark), quiz.Questions.Count, 0, quiz.PassingMark, null);
    }

    private async Task UpdateSubmissionWithAnswers(QuizSubmission quizSubmission, Quiz quiz) {
        long score = 0;
        int totalQuestions;
        int correctAnswers = 0;
        long totalScore = 0;
        List<QuestionAnswer> answers = new List<QuestionAnswer>();

        var questions = quiz.Questions.ToDictionary(q => q.Id.Value.ToString());

        totalQuestions = questions.Count;
        totalScore = questions.Sum(q => q.Value.Mark);

        foreach (var q in quizSubmission.Answers!) {
            if (q.QuestionType == QuestionType.CodeSnippet.ToString()) {
                if (questions.TryGetValue(q.Id, out var question)) {
                    var codeExecute = await CreateCodeExecute(
                        question.ProblemId!.Value,
                        q.Problem!.CodeAnswer!.SolutionCode,
                        q.Problem!.CodeAnswer!.LanguageCode
                    );
                    if (IsCorrect(codeExecute)) {
                        correctAnswers++;
                        score += question.Mark;
                    }
                    answers.Add(CreateAnswerProblem(q, codeExecute));
                }
            } else {
                if (questions.TryGetValue(q.Id, out var question)) {
                    if (q.Choices != null && q.UserAnswers != null) {
                        var correctChoices = q.Choices.Where(c => c.IsCorrect).Select(c => c.Id).ToList();
                        bool allAnswersCorrect = q.UserAnswers.All(userAnswer => correctChoices.Contains(userAnswer));
                        if (allAnswersCorrect && q.UserAnswers.Count == correctChoices.Count) {
                            correctAnswers++;
                            score += question.Mark;
                        }
                    }
                    answers.Add(q);
                }
            }
        }

        quizSubmission.UpdateSubmitResult(score, totalScore, totalQuestions, correctAnswers,quiz.PassingMark, answers);
    }


    private async Task<CodeExecuteDto> CreateCodeExecute(Guid problemId, string solutionCode, string languageCode) {
        var problem = await problemRepository.GetByIdDetailAsync(problemId);
        var testCases = problem?.TestCases.Select(tc => new TestCaseInputDto(tc.Inputs))?.ToList() ?? new List<TestCaseInputDto>();
        var codeExecute = await sender.Send(new CreateProblemCodeExecuteCommand(
            problemId, new CreateCodeExecuteDto(languageCode, solutionCode, testCases)));

        return codeExecute.CodeExecuteDto;
    }

    private bool IsCorrect(CodeExecuteDto codeExecuteDto) {
        return codeExecuteDto.Status.Id == 3 && codeExecuteDto.Status.Description.Equals(SubmissionConstant.Accepted);
    }

    private QuestionAnswer CreateAnswerProblem(QuestionAnswer q, CodeExecuteDto codeExecute) {
        return new QuestionAnswer() {
            Id = q.Id,
            QuestionType = q.QuestionType,
            Content = q.Content,
            Choices = q.Choices,
            UserAnswers = q.UserAnswers,
            Problem = new ProblemAnswer() {
                Id = q.Problem!.Id,
                CodeAnswer = q.Problem.CodeAnswer,
                Token = codeExecute.Token,
                RunTimeErrors = codeExecute.RunTimeErrors,
                CompileErrors = codeExecute.CompileErrors,
                ExecutionTime = codeExecute.ExecutionTime,
                MemoryUsage = codeExecute.MemoryUsage,
                TestResults = codeExecute.TestResults,
                Status = codeExecute.Status
            }

        };
    }
}

