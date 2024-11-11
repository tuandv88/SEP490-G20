using Community.Application.Models.UserDiscussions.Dtos;

namespace Community.Application.Models.UserDiscussions.Commands.CreateUserDiscussion;

public record CreateUserDiscussionCommand(CreateUserDiscussionDto CreateUserDiscussionDto) : ICommand<CreateUserDiscussionResult>;

public record CreateUserDiscussionResult(Guid Id, bool IsSuccess);

public class CreateUserDiscussionCommandValidator : AbstractValidator<CreateUserDiscussionCommand>
{
    public CreateUserDiscussionCommandValidator()
    {
        RuleFor(x => x.CreateUserDiscussionDto.UserId)
            .NotEmpty().WithMessage("UserId must not be empty.");

        RuleFor(x => x.CreateUserDiscussionDto.DiscussionId)
            .NotEmpty().WithMessage("DiscussionId must not be empty.");

        RuleFor(x => x.CreateUserDiscussionDto.IsFollowing)
            .NotNull().WithMessage("IsFollowing must not be null.");

        RuleFor(x => x.CreateUserDiscussionDto.NotificationsEnabled)
            .NotNull().WithMessage("NotificationsEnabled must not be null.");
    }
}