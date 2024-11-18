using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Commands.CreateCourse;

public record CreateCourseCommand(CreateCourseDto CreateCourseDto) : ICommand<CreateCourseResult>;
public record CreateCourseResult(Guid Id);
public class CreateCourseCommandValidator : AbstractValidator<CreateCourseCommand>
{
    public CreateCourseCommandValidator()
    {
        RuleFor(x => x.CreateCourseDto.Title)
            .NotNull().WithMessage("Title must not be null.")
            .NotEmpty().WithMessage("Title must not be empty.");

        RuleFor(x => x.CreateCourseDto.Description)
            .NotNull().WithMessage("Description must not be null.")
            .NotEmpty().WithMessage("Description must not be empty.");

        RuleFor(x => x.CreateCourseDto.Headline)
            .NotNull().WithMessage("Headline must not be null.")
            .NotEmpty().WithMessage("Headline must not be empty.");

        RuleFor(x => x.CreateCourseDto.TimeEstimation)
            .GreaterThan(0).WithMessage("TimeEstimation must be greater than zero.");

        RuleFor(x => x.CreateCourseDto.Prerequisites)
            .NotNull().WithMessage("Prerequisites must not be null.")
            .NotEmpty().WithMessage("Prerequisites must not be empty.");

        RuleFor(x => x.CreateCourseDto.Objectives)
            .NotNull().WithMessage("Objectives must not be null.")
            .NotEmpty().WithMessage("Objectives must not be empty.");

        RuleFor(x => x.CreateCourseDto.TargetAudiences)
            .NotNull().WithMessage("TargetAudiences must not be null.")
            .NotEmpty().WithMessage("TargetAudiences must not be empty.");

        RuleFor(x => x.CreateCourseDto.ScheduledPublishDate)
            .Must(BeValidDateTimeOrNull).WithMessage("ScheduledPublishDate must be a valid UTC date or null.");

        RuleFor(x => x.CreateCourseDto.Image)
            .NotNull().WithMessage("ImageUrl must not be null.");

        RuleFor(x => x.CreateCourseDto.CourseLevel)
           .NotNull().WithMessage("CourseLevel must not be null.")
           .NotEmpty().WithMessage("CourseLevel must not be empty.")
           .Must(BeValidCourseLevel).WithMessage("CourseLevel must be a valid value (Basic, Intermediate, Advanced, Expert).");

        RuleFor(x => x.CreateCourseDto.Price)
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

    private bool BeValidCourseLevel(string courseLevel)
    {
        return Enum.TryParse(typeof(CourseLevel), courseLevel, true, out _);
    }
}
