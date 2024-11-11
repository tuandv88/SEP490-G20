using Community.Application.Models.UserDiscussions.Dtos;

namespace Community.Application.Models.UserDiscussions.Commands.UpdateUserDiscussion;
public record UpdateUserDiscussionCommand(UpdateUserDiscussionDto UpdateUserDiscussionDto) : ICommand<UpdateUserDiscussionResult>;
public record UpdateUserDiscussionResult(bool IsSuccess);
public class UpdateUserDiscussionCommandValidator : AbstractValidator<UpdateUserDiscussionCommand>
{
    public UpdateUserDiscussionCommandValidator()
    {
        RuleFor(x => x.UpdateUserDiscussionDto.Id)
            .NotEmpty().WithMessage("UserDiscussion ID must not be empty.");

        RuleFor(x => x.UpdateUserDiscussionDto.DateFollowed)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("DateFollowed cannot be a future date.");

        RuleFor(x => x.UpdateUserDiscussionDto.LastViewed)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("LastViewed cannot be a future date.");
    }
}