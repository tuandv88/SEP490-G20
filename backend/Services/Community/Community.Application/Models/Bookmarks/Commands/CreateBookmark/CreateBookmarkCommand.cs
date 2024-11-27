using Community.Application.Models.Bookmarks.Dtos;

namespace Community.Application.Models.Bookmarks.Commands.CreateBookmark;

public record CreateBookmarkResult(Guid? Id, bool IsSuccess);
[Authorize]
public record CreateBookmarkCommand(CreateBookmarkDto CreateBookmarkDto) : ICommand<CreateBookmarkResult>;
public class CreateBookmarkCommandValidator : AbstractValidator<CreateBookmarkCommand>
{
    public CreateBookmarkCommandValidator()
    {
        RuleFor(x => x.CreateBookmarkDto.DiscussionId)
            .NotEmpty().WithMessage("DiscussionId must not be empty.");
    }
}