using Community.Application.Models.Bookmarks.Dtos;

namespace Community.Application.Models.Bookmarks.Commands.UpdateBookmark;

public record UpdateBookmarkResult(bool IsSuccess, string Message);

public record UpdateBookmarkCommand(UpdateBookmarkDto UpdateBookmarkDto) : ICommand<UpdateBookmarkResult>;

public class UpdateBookmarkCommandValidator : AbstractValidator<UpdateBookmarkCommand>
{
    public UpdateBookmarkCommandValidator()
    {
        RuleFor(x => x.UpdateBookmarkDto.DiscussionId)
            .NotEmpty().WithMessage("DiscussionId must not be empty.");

        RuleFor(x => x.UpdateBookmarkDto.DateBookmarked)
            .NotEmpty().WithMessage("DateBookmarked must not be empty.");
    }
}