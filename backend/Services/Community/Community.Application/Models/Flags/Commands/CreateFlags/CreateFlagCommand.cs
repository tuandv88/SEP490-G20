using Community.Application.Models.Flags.Dtos;

namespace Community.Application.Models.Flags.Commands.CreateFlags;

[Authorize($"{PoliciesType.Administrator}")]
public record CreateFlagCommand(CreateFlagDto CreateFlagDto) : ICommand<CreateFlagResult>;

public record CreateFlagResult(bool IsSuccess);

// Validator
public class CreateFlagCommandValidator : AbstractValidator<CreateFlagCommand>
{
    public CreateFlagCommandValidator()
    {
        RuleFor(x => x.CreateFlagDto.IdDiscussion)
            .NotEmpty().WithMessage("Discussion ID must not be empty.");

        RuleFor(x => x.CreateFlagDto.Reason)
            .NotEmpty().WithMessage("Reason must not be empty.");
    }
}
