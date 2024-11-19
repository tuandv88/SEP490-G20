using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Courses.Commands.ChangeCourseStatus;

[Authorize(Roles = $"{RoleType.Administrator}")]
public record ChangeCourseStatusCommand(Guid CourseId, string CourseStatus): ICommand<ChangeCourseStatusResult>;
public record ChangeCourseStatusResult(bool IsSuccess, string Message);

public class ChangeCourseStatusCommandValidator : AbstractValidator<ChangeCourseStatusCommand> {
    public ChangeCourseStatusCommandValidator() {
        RuleFor(x => x.CourseStatus)
            .NotNull().WithMessage("CourseStatus must not be null.")
            .NotEmpty().WithMessage("CourseStatus must not be empty.")
            .Must(BeValidCourseStatus).WithMessage("CourseStatus must be a valid value (Draft, Published, Scheduled, Archived).");
    }
    private bool BeValidCourseStatus(string courseStatus) {
        return Enum.TryParse(typeof(CourseStatus), courseStatus, out _);
    }
}