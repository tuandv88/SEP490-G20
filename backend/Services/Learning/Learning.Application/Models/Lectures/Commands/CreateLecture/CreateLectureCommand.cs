using Learning.Application.Models.Chapters.Commands.CreateChapter;
using Learning.Application.Models.Lectures.Dtos;

namespace Learning.Application.Models.Lectures.Commands.CreateLecture;
public record CreateLectureCommand : ICommand<CreateLectureResult> {
    public required Guid ChapterId;
    public required CreateLectureDto CreateLectureDto;
}
public record CreateLectureResult(Guid Id);
public class CreateLectureCommandValidator : AbstractValidator<CreateLectureCommand> {
    public CreateLectureCommandValidator() {
        RuleFor(x => x.CreateLectureDto.Title)
            .NotNull()
            .NotEmpty().WithMessage("Title is required.");

        RuleFor(x => x.CreateLectureDto.Summary)
            .NotNull()
            .NotEmpty().WithMessage("Description is required.");

        RuleFor(x => x.CreateLectureDto.TimeEstimation)
            .GreaterThan(0).WithMessage("Time estimation must be greater than zero.");

        RuleFor(x => x.CreateLectureDto.OrderIndex)
            .GreaterThanOrEqualTo(0).WithMessage("Order index must be greater than or equal to zero.");
    }
}


