using Community.Application.Models.Flags.Dtos;

namespace Community.Application.Models.Flags.Commands.UpdateFlags;

[Authorize($"{PoliciesType.Administrator}")]
public record UpdateFlagCommand(UpdateFlagDto UpdateFlagDto) : ICommand<UpdateFlagResult>;

public record UpdateFlagResult(bool IsSuccess);

// Validator
public class UpdateFlagCommandValidator : AbstractValidator<UpdateFlagCommand>
{
    public UpdateFlagCommandValidator()
    {
        RuleFor(x => x.UpdateFlagDto.Id)
            .NotEmpty().WithMessage("Flag ID must not be empty.");

        RuleFor(x => x.UpdateFlagDto.Reason)
            .NotEmpty().WithMessage("Reason must not be empty.");
    }
}
