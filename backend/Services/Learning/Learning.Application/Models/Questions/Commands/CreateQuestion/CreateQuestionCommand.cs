using Learning.Application.Models.Problems.Commands.CreateProblem;
using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.Questions.Dtos;
using Learning.Domain.Enums;

namespace Learning.Application.Models.Questions.Commands.CreateQuestion;
public record CreateQuestionCommand : ICommand<CreateQuestionResult>
{
    public required Guid QuizId;
    public required CreateQuestionDto CreateQuestionDto;
}
public record CreateQuestionResult(Guid Id);


public class CreateQuestionCommandValidator : AbstractValidator<CreateQuestionCommand>
{
    private readonly CreateProblemCommandValidator _problemValidator;
    public CreateQuestionCommandValidator()
    {
        _problemValidator = new CreateProblemCommandValidator();
        RuleFor(x => x.CreateQuestionDto.Content)
            .NotEmpty().WithMessage("Content is required.");

        RuleFor(x => x.CreateQuestionDto.QuestionType)
            .NotEmpty().WithMessage("QuestionType is required.")
            .Must(value => Enum.TryParse(typeof(QuestionType), value, out _))
            .WithMessage("QuestionType must be one of the following: MultipleChoice, MultipleSelect, TrueFalse, ShortAnswer, CodeSnippet.");

        RuleFor(x => x.CreateQuestionDto.QuestionLevel)
            .NotEmpty().WithMessage("QuestionLevel is required.")
            .Must(value => Enum.TryParse(typeof(QuestionLevel), value, out _))
            .WithMessage("QuestionLevel must be one of the following: EASY, MEDIUM, HARD, EXPERT.");

        RuleFor(x => x.CreateQuestionDto.Mark)
            .GreaterThan(0).WithMessage("Mark must be greater than 0.");

        RuleFor(x => x.CreateQuestionDto.OrderIndex)
            .GreaterThanOrEqualTo(0).WithMessage("OrderIndex must be 0 or greater.");

        RuleFor(x => x.CreateQuestionDto.Problem)
            .NotNull()
            .When(x => x.CreateQuestionDto.QuestionType == QuestionType.CodeSnippet.ToString())
            .WithMessage("Problem must be specified when QuestionType is CodeSnippet.");

        RuleFor(x => x.CreateQuestionDto.QuestionOptions)
            .Must(list => list != null && list.Count > 0)
            .When(x => x.CreateQuestionDto.QuestionType != QuestionType.CodeSnippet.ToString())
            .WithMessage("QuestionOptions must contain at least one option when QuestionType is not CodeSnippet.");
    }
}