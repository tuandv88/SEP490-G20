using FluentValidation;
using MediatR;
using User.Application.Models.LearningPaths.Dtos;

namespace User.Application.Models.LearningPaths.Commands.UpdateLearningPath
{
    public record UpdateLearningPathCommand(UpdateLearningPathDto LearningPathDto) : IRequest<bool>;

    public class UpdateLearningPathCommandValidator : AbstractValidator<UpdateLearningPathCommand>
    {
        public UpdateLearningPathCommandValidator()
        {
            // Kiểm tra các trường trong DTO
            RuleFor(x => x.LearningPathDto.PathName)
                .NotNull()
                .NotEmpty().WithMessage("Path Name is required.");

            RuleFor(x => x.LearningPathDto.StartDate)
                .NotNull()
                .WithMessage("Start Date is required.");

            RuleFor(x => x.LearningPathDto.EndDate)
                .NotNull()
                .WithMessage("End Date is required.")
                .GreaterThan(x => x.LearningPathDto.StartDate)
                .WithMessage("End Date must be greater than Start Date.");

            RuleFor(x => x.LearningPathDto.Status)
                .IsInEnum()
                .WithMessage("Invalid Status value.");
        }
    }
}
