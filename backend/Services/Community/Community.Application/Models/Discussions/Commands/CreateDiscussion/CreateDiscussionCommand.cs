using Community.Application.Models.Discussions.Dtos;

namespace Community.Application.Models.Discussions.Commands.CreateDiscussion;
public record CreateDiscussionResult(Guid Id);

public record CreateDiscussionCommand(CreateDiscussionDto CreateDiscussionDto) : ICommand<CreateDiscussionResult>;

public class CreateDiscussionCommandValidator : AbstractValidator<CreateDiscussionCommand>
{
    public CreateDiscussionCommandValidator()
    {
        RuleFor(x => x.CreateDiscussionDto.UserId).NotEmpty().WithMessage("UserId must not be empty.");
        RuleFor(x => x.CreateDiscussionDto.CategoryId).NotEmpty().WithMessage("CategoryId must not be empty.");
        RuleFor(x => x.CreateDiscussionDto.Title).NotEmpty().WithMessage("Title must not be empty.");
        RuleFor(x => x.CreateDiscussionDto.Description).NotEmpty().WithMessage("Description must not be empty.");
        RuleFor(x => x.CreateDiscussionDto.Tags).NotNull().WithMessage("Tags must not be null.");
        RuleFor(x => x.CreateDiscussionDto.IsActive).NotNull().WithMessage("IsActive must not be null.");
    }
}