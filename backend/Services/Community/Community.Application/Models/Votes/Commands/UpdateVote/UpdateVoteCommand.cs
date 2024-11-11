using Community.Application.Models.Votes.Dtos;

namespace Community.Application.Models.Votes.Commands.UpdateVote;

public record UpdateVoteResult(bool IsSuccess);

public record UpdateVoteCommand(UpdateVoteDto UpdateVoteDto) : ICommand<UpdateVoteResult>;

public class UpdateVoteCommandValidator : AbstractValidator<UpdateVoteCommand>
{
    public UpdateVoteCommandValidator()
    {
        RuleFor(x => x.UpdateVoteDto.VoteType)
            .Must(BeValidVoteType)
            .WithMessage("VoteType must be a valid value (Like, Dislike).");

        RuleFor(x => x.UpdateVoteDto.DateVoted)
            .Must(BeValidDateTime)
            .WithMessage("DateVoted must be a valid DateTime.");

        RuleFor(x => x.UpdateVoteDto.IsActive)
            .NotNull()
            .WithMessage("IsActive must not be null.");
    }

    private bool BeValidVoteType(string voteType)
    {
        return Enum.TryParse(typeof(VoteType), voteType, true, out _);
    }

    private bool BeValidDateTime(string dateVoted)
    {
        return DateTime.TryParse(dateVoted, out _);
    }
}
