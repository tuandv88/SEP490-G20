using Learning.Application.Models.Courses.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Courses.Commands.CreateCoureReview;

[Authorize]
public record CreateCoureReviewCommand(CreateCourseReviewDto CourseReview, Guid CourseId): ICommand<CreateCourseReviewResult>;
public record CreateCourseReviewResult(bool IsSuccess);
public class CreateCoureReviewCommandValidator : AbstractValidator<CreateCoureReviewCommand> {
    public CreateCoureReviewCommandValidator() {
        RuleFor(command => command.CourseReview.Rating)
           .GreaterThanOrEqualTo(1).WithMessage("Rating must be greater than or equal 1.")
           .LessThanOrEqualTo(5).WithMessage("Rating must be less than or equal 5.");

        RuleFor(command => command.CourseReview.Feedback)
            .NotEmpty().WithMessage("Feedback cannot be empty.");
    }
}