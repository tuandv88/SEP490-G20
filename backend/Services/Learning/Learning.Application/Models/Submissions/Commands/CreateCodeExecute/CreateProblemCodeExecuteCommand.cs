using Learning.Application.Models.Submissions.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Submissions.Commands.CreateCodeExecute;

[Authorize]
public record CreateProblemCodeExecuteCommand(Guid ProblemId, CreateCodeExecuteDto CreateCodeExecuteDto) : ICommand<CreateProblemCodeExecuteResult>;
public record CreateProblemCodeExecuteResult(CodeExecuteDto CodeExecuteDto);

public class CreateProblemCodeExecuteCommandValidator : AbstractValidator<CreateProblemCodeExecuteCommand> {
    public CreateProblemCodeExecuteCommandValidator() {
        RuleFor(command => command.CreateCodeExecuteDto.LanguageCode)
            .NotEmpty()
            .WithMessage("LanguageCode is required.")
            .Must(BeAValidLanguageCode)
            .WithMessage("LanguageCode must be a valid programming language.");
    }
    private bool BeAValidLanguageCode(string languageCode) {
        return Enum.TryParse(languageCode, true, out LanguageCode parsedLanguageCode) && Enum.IsDefined(typeof(LanguageCode), parsedLanguageCode);
    }
}