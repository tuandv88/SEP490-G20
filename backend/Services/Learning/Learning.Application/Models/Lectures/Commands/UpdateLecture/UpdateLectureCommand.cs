using Learning.Application.Models.Lectures.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Lectures.Commands.UpdateLecture;

[Authorize(Roles = $"{RoleType.Administrator}")]
public record UpdateLectureCommand(Guid ChapterId, Guid LectureId, UpdateLectureDto Lecture) : ICommand<UpdateLectureResult>;
public record UpdateLectureResult(bool IsSuccess);

public class UpdateLectureCommandValidator : AbstractValidator<UpdateLectureCommand> {
    public UpdateLectureCommandValidator() {
        RuleFor(x => x.Lecture.Title)
            .NotNull().WithMessage("Title must not be null.")
            .NotEmpty().WithMessage("Title must not be empty.");

        RuleFor(x => x.Lecture.Summary)
            .NotNull().WithMessage("Summary must not be null.")
            .NotEmpty().WithMessage("Summary must not be empty.");

        RuleFor(x => x.Lecture.TimeEstimation)
            .GreaterThan(0).WithMessage("Time estimation must be greater than zero.");

        RuleFor(x => x.Lecture.Point)
            .GreaterThanOrEqualTo(0).WithMessage("Point must be greater than or equal to zero.");

        RuleFor(x => x.Lecture.LectureType)
            .Must(BeValidLectureType).WithMessage("Lecture type must be a valid value (Lesson, Quiz, Practice).");

        RuleFor(x => x.Lecture.IsFree)
            .NotNull().WithMessage("IsFree must not be null.");
    }
    private bool BeValidLectureType(string lectureType) {
        return Enum.TryParse(typeof(LectureType), lectureType, true, out _);
    }
}