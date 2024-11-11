using Community.Application.Models.Votes.Dtos;

namespace Community.Application.Models.Votes.Commands.CreateVote;

public record CreateVoteResult(Guid? Id, bool IsSuccess);

public record CreateVoteCommand(CreateVoteDto CreateVoteDto) : ICommand<CreateVoteResult>;

public class CreateVoteCommandValidator : AbstractValidator<CreateVoteCommand>
{
    public CreateVoteCommandValidator()
    {
        RuleFor(x => x.CreateVoteDto.UserId)
            .NotEmpty().WithMessage("UserId must not be empty.");

        RuleFor(x => x.CreateVoteDto.VoteType)
            .NotNull().WithMessage("VoteType must not be null.")
            .NotEmpty().WithMessage("VoteType must not be empty.")
            .Must(BeValidVoteType).WithMessage("VoteType must be a valid value (Like, Dislike).");

        RuleFor(x => x.CreateVoteDto.DateVoted)
            .Must(BeValidDateTime).WithMessage("DateVoted must be a valid DateTime.");

        RuleFor(x => x.CreateVoteDto.IsActive)
            .NotNull().WithMessage("IsActive must not be null.");
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
