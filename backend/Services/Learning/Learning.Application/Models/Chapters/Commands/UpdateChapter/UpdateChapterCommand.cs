using Learning.Application.Models.Chapters.Dtos;

namespace Learning.Application.Models.Chapters.Commands.UpdateChapter;
public record UpdateChapterCommand(Guid ChapterId, Guid CourseId, UpdateChapterDto UpdateChapterDto) : ICommand<UpdateChapterResult>;
public record UpdateChapterResult(bool IsSuccess);

public class UpdateChapterCommandValidator : AbstractValidator<UpdateChapterCommand> {
    public UpdateChapterCommandValidator() {
        RuleFor(x => x.UpdateChapterDto.Title)
            .NotNull()
            .NotEmpty().WithMessage("Title is required.");

        RuleFor(x => x.UpdateChapterDto.Description)
            .NotNull()
            .NotEmpty().WithMessage("Description is required.");

        RuleFor(x => x.UpdateChapterDto.TimeEstimation)
            .GreaterThan(0).WithMessage("Time estimation must be greater than zero.");

        RuleFor(x => x.UpdateChapterDto.OrderIndex)
            .GreaterThan(0).WithMessage("Order index must be greater than to zero.");
    }
}
