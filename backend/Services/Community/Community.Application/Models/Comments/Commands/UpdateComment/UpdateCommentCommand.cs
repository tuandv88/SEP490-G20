using Community.Application.Models.Comments.Dtos;

namespace Community.Application.Models.Comments.Commands.UpdateComment;

public record UpdateCommentResult(bool IsSuccess);

public record UpdateCommentCommand(UpdateCommentDto UpdateCommentDto) : ICommand<UpdateCommentResult>;

public class UpdateCommentCommandValidator : AbstractValidator<UpdateCommentCommand>
{
    public UpdateCommentCommandValidator()
    {
        RuleFor(x => x.UpdateCommentDto.Content)
            .NotEmpty()
            .WithMessage("Content must not be empty.");

        RuleFor(x => x.UpdateCommentDto.UserId)
            .NotEmpty()
            .WithMessage("UserId must not be empty.");

        RuleFor(x => x.UpdateCommentDto.DiscussionId)
            .NotEmpty()
            .WithMessage("DiscussionId must not be empty.");

        RuleFor(x => x.UpdateCommentDto.Depth)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Depth must be zero or a positive integer.");

        RuleFor(x => x.UpdateCommentDto.IsActive)
            .NotNull()
            .WithMessage("IsActive must not be null.");
    }
}
