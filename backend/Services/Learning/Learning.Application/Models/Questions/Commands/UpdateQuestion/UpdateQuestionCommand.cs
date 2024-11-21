using Learning.Application.Models.Problems.Commands.CreateProblem;
using Learning.Application.Models.Questions.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Questions.Commands.UpdateQuestion;
[Authorize($"{PoliciesType.Administrator}")]
public record UpdateQuestionCommand(Guid QuizId, Guid QuestionId, UpdateQuestionDto Question): ICommand<UpdateQuestionResult>;
public record UpdateQuestionResult(bool IsSucess);


public class UpdateQuestionCommandValidator : AbstractValidator<UpdateQuestionCommand> {
    private readonly CreateProblemCommandValidator _problemValidator;
    public UpdateQuestionCommandValidator() {
        _problemValidator = new CreateProblemCommandValidator();
        RuleFor(x => x.Question.Content)
            .NotEmpty().WithMessage("Content is required.");

        RuleFor(x => x.Question.QuestionType)
            .NotEmpty().WithMessage("QuestionType is required.")
            .Must(value => Enum.TryParse(typeof(QuestionType), value, out _))
            .WithMessage("QuestionType must be one of the following: MultipleChoice, MultipleSelect, TrueFalse, ShortAnswer, CodeSnippet.");

        RuleFor(x => x.Question.QuestionLevel)
            .NotEmpty().WithMessage("QuestionLevel is required.")
            .Must(value => Enum.TryParse(typeof(QuestionLevel), value, out _))
            .WithMessage("QuestionLevel must be one of the following: EASY, MEDIUM, HARD, EXPERT.");

        RuleFor(x => x.Question.Mark)
            .GreaterThan(0).WithMessage("Mark must be greater than 0.");

        RuleFor(x => x.Question.Problem)
            .NotNull()
            .When(x => x.Question.QuestionType == QuestionType.CodeSnippet.ToString())
            .WithMessage("Problem must be specified when QuestionType is CodeSnippet.");

        RuleFor(x => x.Question.QuestionOptions)
            .Must(list => list != null && list.Count > 0)
            .When(x => x.Question.QuestionType != QuestionType.CodeSnippet.ToString())
            .WithMessage("QuestionOptions must contain at least one option when QuestionType is not CodeSnippet.");
    }
}