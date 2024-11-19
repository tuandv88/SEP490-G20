using Learning.Application.Models.Problems.Commands.UpdateProblem;
using Learning.Application.Models.QuestionOptions.Dtos;
using Learning.Application.Models.Questions.Dtos;

namespace Learning.Application.Models.Questions.Commands.UpdateQuestion;
public class UpdateQuestionHandler(IQuizRepository quizRepository, IQuestionRepository questionRepository,
    IQuestionOptionRepository questionOptionRepository, ISender sender) : ICommandHandler<UpdateQuestionCommand, UpdateQuestionResult> {
    public async Task<UpdateQuestionResult> Handle(UpdateQuestionCommand request, CancellationToken cancellationToken) {
        var quiz = await quizRepository.GetByIdDetailAsync(request.QuizId);
        if(quiz == null) {
            throw new NotFoundException(nameof(Quiz), request.QuizId);
        }
        var question = quiz.Questions.FirstOrDefault(q => q.Id.Equals(QuestionId.Of(request.QuestionId)));
        if(question == null) {
            throw new NotFoundException(nameof(Question), request.Question);
        }
        await UpdateQuestion(question, request.Question);

        await questionRepository.UpdateAsync(question);
        await questionRepository.SaveChangesAsync(cancellationToken);

        return new UpdateQuestionResult(true);
    }
    private async Task UpdateQuestion(Question question, UpdateQuestionDto questionDto) {
        var questionType = (QuestionType)Enum.Parse(typeof(QuestionType), questionDto.QuestionType);
        var questionLevel = (QuestionLevel)Enum.Parse(typeof(QuestionLevel), questionDto.QuestionLevel);
        question.IsActive = questionDto.IsActive;
        question.Content = questionDto.Content;
        question.QuestionType = questionType;
        question.QuestionLevel = questionLevel;
        question.Mark = questionDto.Mark;

        await UpdateQuestionOtion(question, questionDto.QuestionOptions);
        if (question.ProblemId != null && questionDto.Problem!=null) {
            await sender.Send(new UpdateProblemCommand(question.ProblemId.Value, questionDto.Problem));
        }
    }

    private async Task UpdateQuestionOtion(Question question, List<UpdateQuestionOptionDto> questionOptions) {
        var existingQuestionOptions = await questionOptionRepository.GetByQuestionAsync(question.Id);
        foreach (var dto in questionOptions) {
            if (dto.Id.HasValue) {
                var existingQuestionOption = existingQuestionOptions.FirstOrDefault(ts => ts.Id.Value == dto.Id.Value);
                if (existingQuestionOption != null) {
                    existingQuestionOption.Content = dto.Content;
                    existingQuestionOption.IsCorrect = dto.IsCorrect;
                    existingQuestionOption.OrderIndex = dto.OrderIndex;
                    await questionOptionRepository.UpdateAsync(existingQuestionOption);
                }
            } else {
                var questionOption = new QuestionOption() {
                    Id = QuestionOptionId.Of(Guid.NewGuid()),
                    QuestionId = question.Id,
                    Content = dto.Content,
                    IsCorrect = dto.IsCorrect,
                    OrderIndex = dto.OrderIndex
                };
                question.AddQuestionOption(questionOption);
                await questionOptionRepository.AddAsync(questionOption);
            }

        }
        var dtoIds = questionOptions.Where(dto => dto.Id.HasValue).Select(dto => dto.Id!.Value).ToList();
        var questionOptionToDelete = existingQuestionOptions.Where(ts => !dtoIds.Contains(ts.Id.Value)).ToList();
        foreach (var ts in questionOptionToDelete) {
            question.RemoveQuestionOption(ts);
            await questionOptionRepository.DeleteAsync(ts);
        }
    }

}

