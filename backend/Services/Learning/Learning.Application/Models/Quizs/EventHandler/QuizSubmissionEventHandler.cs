﻿using BuildingBlocks.Messaging.Events.Learnings;
using Learning.Application.Models.Submissions.Commands.CreateCodeExecute;
using Learning.Application.Models.Submissions.Dtos;
using Learning.Application.Models.TestCases.Dtos;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace Learning.Application.Models.Quizs.EventHandler;
public class QuizSubmissionEventHandler(IQuizSubmissionRepository quizSubmissionRepository, ISender sender, IProblemRepository problemRepository,
    IQuizRepository quizRepository, ILogger<QuizSubmissionEventHandler> logger, IPublishEndpoint publishEndpoint) : IConsumer<QuizSubmissionEvent> {
    public async Task Consume(ConsumeContext<QuizSubmissionEvent> context) {
        logger.LogInformation($"Start quiz submission event: {context.Message.SubmissionId}");
        //xử lí bài nộp ở đây
        var quizSubmission = await quizSubmissionRepository.GetByIdAsync(context.Message.SubmissionId);
        logger.LogInformation($"Get quiz submission: {context.Message.SubmissionId}");
        if (quizSubmission == null) {
            logger.LogInformation($"Submission is not found submissionId : {context.Message.SubmissionId}");
            return;
        }
        logger.LogInformation($"Quiz submission status: {quizSubmission.Status.ToString()}");
        if (quizSubmission.Status == QuizSubmissionStatus.Processing) {
            logger.LogInformation($"Quiz submission processing event: {context.Message.SubmissionId}");
            var quiz = await quizRepository.GetByIdDetailAsync(quizSubmission.QuizId.Value);
            if (quiz == null) {
                logger.LogInformation($"quiz is not found quizId : {quizSubmission.QuizId.Value}");
                return;
            }
            if (quizSubmission.Answers == null) {
                logger.LogInformation($"Quiz submission answer null event: {context.Message.SubmissionId}");
                UpdateSubmissionWithoutAnswers(quizSubmission, quiz);
            } else {
                logger.LogInformation($"Quiz submission answer not null event: {context.Message.SubmissionId}");
                await UpdateSubmissionWithAnswers(quizSubmission, quiz);
            }

            if (quiz.QuizType != QuizType.ASSESSMENT)
            {
                logger.LogInformation($"Quiz submission successfully with domain event");
                quizSubmission.UpdateStatus(QuizSubmissionStatus.Success);
            }
            else
            {
                logger.LogInformation($"Quiz submission successfully with out domain event");
                quizSubmission.Status = QuizSubmissionStatus.Success;
            }
            await quizSubmissionRepository.UpdateAsync(quizSubmission);
            logger.LogInformation($"Quiz submission update event: {context.Message.SubmissionId}");
            //Kiểm tra nếu là kiểu ASSESSMENT thì public lên một event để AI phân tích tạo một lộ trình học
            if (quiz.QuizType == QuizType.ASSESSMENT) {
                await publishEndpoint.Publish(new AssessmentQuizScoringCompletedEvent() {
                    QuizSubmissionId = quizSubmission.Id.Value,
                    UserId = quizSubmission.UserId.Value,
                    QuizId = quizSubmission.Id.Value,
                    StartTime = quizSubmission.StartTime,
                    SubmissionDate = quizSubmission.SubmissionDate,
                    Score = quizSubmission.Score,
                    TotalScore = quizSubmission.TotalScore,
                    TotalQuestions = quizSubmission.TotalQuestions,
                    CorrectAnswers = quizSubmission.CorrectAnswers,
                    PassingMark = quizSubmission.PassingMark,
                    ResultAnswers = JsonConvert.SerializeObject(quizSubmission.Answers),
                });
                logger.LogInformation($"Quiz submission publish event AssessmentQuizScoringCompletedEvent: {context.Message.SubmissionId}");
            }
            await quizSubmissionRepository.SaveChangesAsync();
        }
        logger.LogInformation($"End quiz submission event: {context.Message.SubmissionId}");
    }
    private void UpdateSubmissionWithoutAnswers(QuizSubmission quizSubmission, Quiz quiz) {
        quizSubmission.UpdateSubmitResult(0, quiz.Questions.Sum(q => q.Mark), quiz.Questions.Count, 0, quiz.PassingMark,
            quiz.Questions.Select(CreateQuestionAnswer).ToList());
    }

    private async Task UpdateSubmissionWithAnswers(QuizSubmission quizSubmission, Quiz quiz) {
        long score = 0;
        int totalQuestions = 0;
        int correctAnswers = 0;
        long totalScore = 0;
        List<QuestionAnswer> answers = new List<QuestionAnswer>();

        var userAnswers = quizSubmission.Answers?.ToDictionary(a => a.Id, a => a) ?? new Dictionary<string, QuestionAnswer>();

        totalQuestions = quiz.Questions.Count;
        totalScore = quiz.Questions.Sum(q => q.Mark);

        foreach (var question in quiz.Questions) {
            if (userAnswers.TryGetValue(question.Id.Value.ToString(), out var userAnswer)) {
                if (question.QuestionType == QuestionType.CodeSnippet) {
                    var codeExecute = await CreateCodeExecute(
                        question.ProblemId!.Value,
                        userAnswer.Problem!.CodeAnswer!.SolutionCode,
                        userAnswer.Problem!.CodeAnswer!.LanguageCode
                    );

                    if (IsCorrect(codeExecute)) {
                        correctAnswers++;
                        score += question.Mark;
                    }
                    answers.Add(CreateAnswerProblem(userAnswer, codeExecute));
                } else {
                    if (userAnswer.Choices != null && userAnswer.UserAnswers != null) {
                        var correctChoices = userAnswer.Choices.Where(c => c.IsCorrect).Select(c => c.Id).ToList();
                        bool allAnswersCorrect = userAnswer.UserAnswers.All(correctChoices.Contains);
                        if (allAnswersCorrect && userAnswer.UserAnswers.Count == correctChoices.Count) {
                            correctAnswers++;
                            score += question.Mark;
                        }
                    }
                    answers.Add(userAnswer);
                }
            } else {
                //thêm những câu hỏi không nằm trong câu trả lời (không trả lời)
                answers.Add(CreateQuestionAnswer(question));
            }
        }

        quizSubmission.UpdateSubmitResult(score, totalScore, totalQuestions, correctAnswers, quiz.PassingMark, answers);
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
            OrderIndex = q.OrderIndex,
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
    private QuestionAnswer CreateQuestionAnswer(Question question) {
        ProblemAnswer? problem = null;
        if (question.ProblemId != null) {
            problem = new ProblemAnswer() {
                Id = question.ProblemId.Value.ToString(),
            };
        }
        return new QuestionAnswer {
            Id = question.Id.Value.ToString(),
            QuestionType = question.QuestionType.ToString(),
            Content = question.Content,
            OrderIndex = question.OrderIndex,
            Choices = question.QuestionOptions.Select(q => new Choice {
                Id = q.Id.Value.ToString(),
                Content = q.Content,
                IsCorrect = q.IsCorrect,
                OrderIndex = q.OrderIndex
            }).ToList(),
            UserAnswers = null,
            Problem = problem
        };
    }
}

