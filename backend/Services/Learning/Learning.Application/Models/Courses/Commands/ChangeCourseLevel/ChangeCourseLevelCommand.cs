using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Courses.Commands.ChangeCourseLevel;

[Authorize($"{PoliciesType.Administrator}")]
public record ChangeCourseLevelCommand(Guid CourseId, string CourseLevel) : ICommand<ChangeCourseLevelResult>;
public record ChangeCourseLevelResult(bool IsSuccess, string Message);

public class ChangeCourseLevelCommandValidator : AbstractValidator<ChangeCourseLevelCommand> {
    public ChangeCourseLevelCommandValidator() {
        RuleFor(x => x.CourseLevel)
            .NotNull().WithMessage("CourseLevel must not be null.")
            .NotEmpty().WithMessage("CourseLevel must not be empty.")
            .Must(BeValidCourseLevel).WithMessage("CourseLevel must be a valid value (Basic, Intermediate, Advanced, Expert).");
    }
    private bool BeValidCourseLevel(string courseLevel) {
        return Enum.TryParse(typeof(CourseLevel), courseLevel, out _);
    }
}