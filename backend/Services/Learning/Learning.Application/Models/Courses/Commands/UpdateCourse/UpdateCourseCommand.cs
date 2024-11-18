using Learning.Application.Models.Courses.Dtos;

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

        RuleFor(x => x.UpdateCourseDto.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Price must be greater than or equal zero.");
    }
    private bool BeValidDateTimeOrNull(string scheduledPublishDate)
    {
        if (string.IsNullOrEmpty(scheduledPublishDate))
        {
            return true;
        }
        return DateTime.TryParse(scheduledPublishDate, out _);
    }
}