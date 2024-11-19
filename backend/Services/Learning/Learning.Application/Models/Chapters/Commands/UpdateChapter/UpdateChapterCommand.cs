using Learning.Application.Models.Chapters.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Chapters.Commands.UpdateChapter;

[Authorize($"{PoliciesType.Administrator}")]
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
    }
}
