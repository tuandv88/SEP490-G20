using Community.Application.Models.Discussions.Dtos;

namespace Community.Application.Models.Discussions.Commands.UpdateDiscussion;

public record UpdateDiscussionCommand(UpdateDiscussionDto UpdateDiscussionDto) : ICommand<UpdateDiscussionResult>;
public record UpdateDiscussionResult(bool IsSuccess);
public class UpdateDiscussionCommandValidator : AbstractValidator<UpdateDiscussionCommand>
{
    public UpdateDiscussionCommandValidator()
    {
        RuleFor(x => x.UpdateDiscussionDto.Title)
            .NotNull().WithMessage("Title must not be null.")
            .NotEmpty().WithMessage("Title must not be empty.");

        RuleFor(x => x.UpdateDiscussionDto.Description)
            .NotNull().WithMessage("Description must not be null.")
            .NotEmpty().WithMessage("Description must not be empty.");

        RuleFor(x => x.UpdateDiscussionDto.UserId)
            .NotEmpty().WithMessage("UserId must not be empty.");

        RuleFor(x => x.UpdateDiscussionDto.CategoryId)
            .NotEmpty().WithMessage("CategoryId must not be empty.");

        RuleFor(x => x.UpdateDiscussionDto.ViewCount)
            .GreaterThanOrEqualTo(0).WithMessage("ViewCount must be greater than or equal to zero.");
    }
}