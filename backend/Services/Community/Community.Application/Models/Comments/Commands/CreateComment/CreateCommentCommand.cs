using Community.Application.Models.Comments.Dtos;

namespace Community.Application.Models.Comments.Commands.CreateComment;

public record CreateCommentResult(Guid? Id, bool IsSuccess);
[Authorize($"{PoliciesType.Administrator},{PoliciesType.Moderator},{PoliciesType.Learner}")]
public record CreateCommentCommand(CreateCommentDto CreateCommentDto) : ICommand<CreateCommentResult>;

public class CreateCommentCommandValidator : AbstractValidator<CreateCommentCommand>
{
    public CreateCommentCommandValidator()
    {
        RuleFor(x => x.CreateCommentDto.DiscussionId)
            .NotEmpty().WithMessage("DiscussionId must not be empty.");

        RuleFor(x => x.CreateCommentDto.Content)
            .NotNull().WithMessage("Content must not be null.")
            .NotEmpty().WithMessage("Content must not be empty.");

        RuleFor(x => x.CreateCommentDto.IsActive)
            .NotNull().WithMessage("IsActive must not be null.");
    }

    private bool BeValidDateTime(string dateCreated)
    {
        return DateTime.TryParse(dateCreated, out _);
    }
}
