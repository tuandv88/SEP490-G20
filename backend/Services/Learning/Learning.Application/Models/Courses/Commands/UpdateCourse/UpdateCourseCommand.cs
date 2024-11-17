using Learning.Application.Models.Courses.Dtos;
using Learning.Domain.Enums;

namespace Learning.Application.Models.Courses.Commands.UpdateCourse;
public record UpdateCourseCommand(Guid CourseId, UpdateCourseDto UpdateCourseDto) : ICommand<UpdateCourseResult>;
public record UpdateCourseResult(bool IsSuccess);

public class UpdateCourseCommandValidator : AbstractValidator<UpdateCourseCommand>
{
    public UpdateCourseCommandValidator()
    {
        RuleFor(x => x.UpdateCourseDto.Title)
            .NotNull().WithMessage("Title must not be null.")
            .NotEmpty().WithMessage("Title must not be empty.");

        RuleFor(x => x.UpdateCourseDto.Description)
            .NotNull().WithMessage("Description must not be null.")
            .NotEmpty().WithMessage("Description must not be empty.");

        RuleFor(x => x.UpdateCourseDto.Headline)
            .NotNull().WithMessage("Headline must not be null.")
            .NotEmpty().WithMessage("Headline must not be empty.");

        RuleFor(x => x.UpdateCourseDto.CourseStatus)
            .NotNull().WithMessage("CourseStatus must not be null.")
            .NotEmpty().WithMessage("CourseStatus must not be empty.")
            .Must(BeValidCourseStatus).WithMessage("CourseStatus must be a valid value (Draft, Published, Scheduled, Archived).");

        RuleFor(x => x.UpdateCourseDto.TimeEstimation)
            .GreaterThan(0).WithMessage("TimeEstimation must be greater than zero.");

        RuleFor(x => x.UpdateCourseDto.Prerequisites)
            .NotNull().WithMessage("Prerequisites must not be null.")
            .NotEmpty().WithMessage("Prerequisites must not be empty.");

        RuleFor(x => x.UpdateCourseDto.Objectives)
            .NotNull().WithMessage("Objectives must not be null.")
            .NotEmpty().WithMessage("Objectives must not be empty.");

        RuleFor(x => x.UpdateCourseDto.TargetAudiences)
            .NotNull().WithMessage("TargetAudiences must not be null.")
            .NotEmpty().WithMessage("TargetAudiences must not be empty.");

        RuleFor(x => x.UpdateCourseDto.ScheduledPublishDate)
            .Must(BeValidDateTimeOrNull).WithMessage("ScheduledPublishDate must be a valid UTC date or null.");

        RuleFor(x => x.UpdateCourseDto.OrderIndex)
            .GreaterThan(0).WithMessage("OrderIndex must be greater than to zero.");

        RuleFor(x => x.UpdateCourseDto.CourseLevel)
           .NotNull().WithMessage("CourseLevel must not be null.")
           .NotEmpty().WithMessage("CourseLevel must not be empty.")
           .Must(BeValidCourseLevel).WithMessage("CourseLevel must be a valid value (Basic, Intermediate, Advanced, Expert).");

        RuleFor(x => x.UpdateCourseDto.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Price must be greater than or equal zero.");
    }
    private bool BeValidCourseStatus(string courseStatus)
    {
        return Enum.TryParse(typeof(CourseStatus), courseStatus, out _);
    }
    private bool BeValidDateTimeOrNull(string scheduledPublishDate)
    {
        if (string.IsNullOrEmpty(scheduledPublishDate))
        {
            return true;
        }
        return DateTime.TryParse(scheduledPublishDate, out _);
    }
    private bool BeValidCourseLevel(string courseLevel)
    {
        return Enum.TryParse(typeof(CourseLevel), courseLevel, true, out _);
    }
}