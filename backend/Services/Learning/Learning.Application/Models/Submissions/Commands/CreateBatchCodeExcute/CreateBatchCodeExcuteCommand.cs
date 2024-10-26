using Learning.Application.Models.Submissions.Dtos.CodeExecution;
using Learning.Domain.Enums;

namespace Learning.Application.Models.Submissions.Commands.CreateBatchCodeExcute;
public record CreateBatchCodeExcuteCommand(BatchCodeExecuteDto BatchCodeExecuteDto) : ICommand<CreateBatchCodeExcuteResult>;
public record CreateBatchCodeExcuteResult(List<CodeExecuteDto> CodeExecuteDtos);

public class CreateBatchCodeExcuteCommandValidator : AbstractValidator<CreateBatchCodeExcuteCommand> {
    public CreateBatchCodeExcuteCommandValidator() {
        RuleFor(command => command.BatchCodeExecuteDto.LanguageCode)
            .Must(BeAValidLanguageCode)
            .WithMessage("LanguageCode must be a valid enum value.");

        RuleFor(command => command.BatchCodeExecuteDto.TestCases)
            .NotEmpty()
            .WithMessage("TestCases cannot be empty.");

        RuleFor(command => command.BatchCodeExecuteDto.SolutionCodes)
            .NotEmpty()
            .WithMessage("SolutionCodes cannot be empty.");
    }

    private bool BeAValidLanguageCode(string languageCode) {
        return Enum.TryParse<LanguageCode>(languageCode, out _);
    }
}
