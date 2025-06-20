﻿
using Learning.Application.Models.Problems.Commands.CreateProblem;
using Learning.Application.Models.Questions.Dtos;

namespace Learning.Application.Models.Questions.Commands.CreateQuestion;
public class CreateQuestionHandler(IQuestionRepository questionRepository, IQuizRepository quizRepository, ISender sender) : ICommandHandler<CreateQuestionCommand, CreateQuestionResult> {
    public async Task<CreateQuestionResult> Handle(CreateQuestionCommand request, CancellationToken cancellationToken) {
        var quiz = await quizRepository.GetByIdAsync(request.QuizId);
        if (quiz == null) {
            throw new NotFoundException(nameof(Quiz), request.QuizId);
        }
        var question = await CreateNewQuestion(request.CreateQuestionDto, quiz);

        await questionRepository.AddAsync(question);
        await questionRepository.SaveChangesAsync(cancellationToken);

        return new CreateQuestionResult(question.Id.Value);
    }

    private async Task<Question> CreateNewQuestion(CreateQuestionDto createQuestionDto, Quiz quiz) {
        var questionType = createQuestionDto.QuestionType;
        ProblemId? problemId = null;
        if (questionType.Equals(QuestionType.CodeSnippet.ToString())) {
            var createProblemResult = await sender.Send(new CreateProblemCommand() { CreateProblemDto = createQuestionDto.Problem! });
            problemId = ProblemId.Of(createProblemResult.Id);
        }
        var question = Question.Create(
                questionId: QuestionId.Of(Guid.NewGuid()),
                quizId: quiz.Id,
                problemId: problemId,
                isActive: createQuestionDto.IsActive,
                content: createQuestionDto.Content,
                questionType: (QuestionType)Enum.Parse(typeof(QuestionType), createQuestionDto.QuestionType),
                questionLevel: (QuestionLevel)Enum.Parse(typeof(QuestionLevel), createQuestionDto.QuestionLevel),
                mark: createQuestionDto.Mark,
                orderIndex: (await questionRepository.CountByQuizAsync(quiz.Id)) + 1
            );

        var questionOptions = createQuestionDto.QuestionOptions.Select(q => new QuestionOption() {
            Id = QuestionOptionId.Of(Guid.NewGuid()),
            QuestionId = question.Id,
            Content = q.Content,
            IsCorrect = q.IsCorrect,
            OrderIndex = q.OrderIndex
        }).ToList();
        question.AddQuestionOption(questionOptions);

        return question;
    }
}

