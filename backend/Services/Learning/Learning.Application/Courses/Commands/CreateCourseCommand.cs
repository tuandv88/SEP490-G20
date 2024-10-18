namespace Learning.Application.Courses.Commands;
public record CreateCourseCommand() : ICommand<CreateSubmissionResult>;
public record CreateCourse();
public class CreateCourseCommandValidator : AbstractValidator<CreateCourseCommand> {
    public CreateCourseCommandValidator() {
        //Validate

    }
}