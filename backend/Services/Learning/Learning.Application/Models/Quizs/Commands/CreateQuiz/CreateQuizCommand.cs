using Learning.Application.Models.Quizs.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Quizs.Commands.CreateQuiz;

[Authorize($"{PoliciesType.Administrator}")]
public record CreateQuizCommand : ICommand<CreateQuizResult> {
    public Guid? LectureId;
    public required CreateQuizDto CreateQuizDto;
}
public record CreateQuizResult(Guid Id);
public class CreateQuizComandValidator : AbstractValidator<CreateQuizCommand> {
    public CreateQuizComandValidator() {
        // Kiểm tra các trường không được để trống hoặc rỗng
        RuleFor(x => x.CreateQuizDto.Title)
            .NotEmpty().WithMessage("Title is required.");

        RuleFor(x => x.CreateQuizDto.Description)
            .NotEmpty().WithMessage("Description is required.");

        RuleFor(x => x.CreateQuizDto.QuizType)
            .NotEmpty().WithMessage("QuizType is required.")
            .Must(value => Enum.TryParse(typeof(QuizType), value, out _))
            .WithMessage("QuizType must be one of the following: PRACTICE, ASSESSMENT, FINAL.");

        RuleFor(x => x.CreateQuizDto.PassingMark)
            .NotNull().WithMessage("PassingMark is required.");

        RuleFor(x => x.CreateQuizDto.TimeLimit)
            .NotNull().WithMessage("TimeLimit is required.");

        RuleFor(x => x.CreateQuizDto.AttemptLimit)
            .NotNull().WithMessage("AttemptLimit is required.");
    }
}
