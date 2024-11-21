using Learning.Application.Models.Lectures.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Lectures.Commands.CreateLecture;

[Authorize($"{PoliciesType.Administrator}")]
public record CreateLectureCommand : ICommand<CreateLectureResult> {
    public required Guid ChapterId;
    public required CreateLectureDto CreateLectureDto;
}
public record CreateLectureResult(Guid Id);
public class CreateLectureCommandValidator : AbstractValidator<CreateLectureCommand> {
    public CreateLectureCommandValidator() {
        RuleFor(x => x.CreateLectureDto.Title)
            .NotNull().WithMessage("Title must not be null.")
            .NotEmpty().WithMessage("Title must not be empty.");

        RuleFor(x => x.CreateLectureDto.Summary)
            .NotNull().WithMessage("Summary must not be null.")
            .NotEmpty().WithMessage("Summary must not be empty.");

        RuleFor(x => x.CreateLectureDto.TimeEstimation)
            .GreaterThan(0).WithMessage("Time estimation must be greater than zero.");

        RuleFor(x => x.CreateLectureDto.Point)
            .GreaterThanOrEqualTo(0).WithMessage("Point must be greater than or equal to zero.");

        RuleFor(x => x.CreateLectureDto.LectureType)
            .Must(BeValidLectureType).WithMessage("Lecture type must be a valid value (Lesson, Quiz, Practice).");

        RuleFor(x => x.CreateLectureDto.IsFree)
            .NotNull().WithMessage("IsFree must not be null.");
    }
    private bool BeValidLectureType(string lectureType) {
        return Enum.TryParse(typeof(LectureType), lectureType, true, out _);
    }
}




