using Learning.Application.Models.Quizs.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Quizs.Commands.UpdateQuiz;

[Authorize($"{PoliciesType.Administrator}")]
public record UpdateQuizCommand(Guid QuizId, UpdateQuizDto Quiz) : ICommand<UpdateQuizResult>;
public record UpdateQuizResult(bool IsSuccess);

public class UpdateQuizCommandValidator : AbstractValidator<UpdateQuizCommand> {
    public UpdateQuizCommandValidator() {
        // Kiểm tra các trường không được để trống hoặc rỗng
        RuleFor(x => x.Quiz.Title)
            .NotEmpty().WithMessage("Title is required.");

        RuleFor(x => x.Quiz.Description)
            .NotEmpty().WithMessage("Description is required.");

        RuleFor(x => x.Quiz.QuizType)
            .NotEmpty().WithMessage("QuizType is required.")
            .Must(value => Enum.TryParse(typeof(QuizType), value, out _))
            .WithMessage("QuizType must be one of the following: PRACTICE, ASSESSMENT, FINAL.");

        RuleFor(x => x.Quiz.PassingMark)
        .NotNull().WithMessage("PassingMark is required.")
        .GreaterThan(0).WithMessage("PassingMark must be a positive value.");

        RuleFor(x => x.Quiz.TimeLimit)
            .NotNull().WithMessage("TimeLimit is required.")
            .GreaterThan(0).WithMessage("TimeLimit must be a positive value.");

        RuleFor(x => x.Quiz.AttemptLimit)
            .NotNull().WithMessage("AttemptLimit is required.")
            .GreaterThan(0).WithMessage("AttemptLimit must be a positive value.");
    }
}
