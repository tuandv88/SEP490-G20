using Learning.Application.Models.Submissions.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Submissions.Commands.CreateBatchCodeExcute;

[Authorize]
public record CreateBatchCodeExcuteCommand(BatchCodeExecuteDto BatchCodeExecuteDto, ResourceLimits ResourceLimits) : ICommand<CreateBatchCodeExcuteResult>;
public record CreateBatchCodeExcuteResult(List<CodeExecuteDto> CodeExecuteDtos);

public class CreateBatchCodeExcuteCommandValidator : AbstractValidator<CreateBatchCodeExcuteCommand> {
    public CreateBatchCodeExcuteCommandValidator() {
        // Validation cho BatchCodeExecuteDto
        RuleFor(command => command.BatchCodeExecuteDto.LanguageCode)
            .Must(BeAValidLanguageCode)
            .WithMessage("LanguageCode must be a valid enum value.");

        RuleFor(command => command.BatchCodeExecuteDto.TestCases)
            .NotEmpty()
            .WithMessage("TestCases cannot be empty.");

        RuleFor(command => command.BatchCodeExecuteDto.SolutionCodes)
            .NotEmpty()
            .WithMessage("SolutionCodes cannot be empty.");

        // Validation cho ResourceLimits
        RuleFor(command => command.ResourceLimits.CpuTimeLimit)
            .InclusiveBetween(ConfigurationResourceLimits.MinCpuTimeLimit, ConfigurationResourceLimits.MaxCpuTimeLimit)
            .WithMessage($"CpuTimeLimit must be between {ConfigurationResourceLimits.MinCpuTimeLimit} and {ConfigurationResourceLimits.MaxCpuTimeLimit} seconds.");

        RuleFor(command => command.ResourceLimits.CpuExtraTime)
            .InclusiveBetween(ConfigurationResourceLimits.MinCpuExtraTime, ConfigurationResourceLimits.MaxCpuExtraTime)
            .WithMessage($"CpuExtraTime must be between {ConfigurationResourceLimits.MinCpuExtraTime} and {ConfigurationResourceLimits.MaxCpuExtraTime} seconds.");

        RuleFor(command => command.ResourceLimits.MemoryLimit)
            .InclusiveBetween(ConfigurationResourceLimits.MinMemoryLimit, ConfigurationResourceLimits.MaxMemoryLimit)
            .WithMessage($"MemoryLimit must be between {ConfigurationResourceLimits.MinMemoryLimit / 1024} MB and {ConfigurationResourceLimits.MaxMemoryLimit / 1024} MB.");

        RuleFor(command => command.ResourceLimits.StackLimit)
            .InclusiveBetween(ConfigurationResourceLimits.MinStackLimit, ConfigurationResourceLimits.MaxStackLimit)
            .WithMessage($"StackLimit must be between {ConfigurationResourceLimits.MinStackLimit / 1024} MB and {ConfigurationResourceLimits.MaxStackLimit / 1024} MB.");

        RuleFor(command => command.ResourceLimits.MaxThread)
            .InclusiveBetween(ConfigurationResourceLimits.MinThreads, ConfigurationResourceLimits.MaxThreads)
            .WithMessage($"MaxThread must be between {ConfigurationResourceLimits.MinThreads} and {ConfigurationResourceLimits.MaxThreads}.");

        RuleFor(command => command.ResourceLimits.MaxFileSize)
            .InclusiveBetween(ConfigurationResourceLimits.MinFileSize, ConfigurationResourceLimits.MaxFileSize)
            .WithMessage($"MaxFileSize must be between {ConfigurationResourceLimits.MinFileSize / 1024} MB and {ConfigurationResourceLimits.MaxFileSize / 1024} MB.");
    }

    private bool BeAValidLanguageCode(string languageCode) {
        return Enum.TryParse<LanguageCode>(languageCode, out _);
    }
}
