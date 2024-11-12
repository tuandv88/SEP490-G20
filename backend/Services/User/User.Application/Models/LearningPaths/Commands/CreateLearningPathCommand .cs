using FluentValidation;
using MediatR;
using User.Application.Models.LearningPaths.Dtos;

namespace User.Application.Models.LearningPaths.Commands.CreateLearningPath
{
    public record CreateLearningPathResult(Guid Id);

    public class CreateLearningPathCommand : IRequest<CreateLearningPathResult>
    {
        public required Guid UserId { get; set; }
        public required LearningPathDto LearningPathDto { get; set; }
    }
    public class CreateLearningPathCommandValidator : AbstractValidator<CreateLearningPathCommand>
    {
        public CreateLearningPathCommandValidator()
        {
            // Kiểm tra PathName không được null và không được rỗng
            RuleFor(x => x.LearningPathDto.PathName)
                .NotNull()
                .NotEmpty().WithMessage("Path Name is required.");

            // Kiểm tra StartDate không được null
            RuleFor(x => x.LearningPathDto.StartDate)
                .NotNull()
                .WithMessage("Start Date is required.");

            // Kiểm tra EndDate không được null và EndDate phải lớn hơn StartDate
            RuleFor(x => x.LearningPathDto.EndDate)
                .NotNull()
                .WithMessage("End Date is required.")
                .GreaterThan(x => x.LearningPathDto.StartDate)
                .WithMessage("End Date must be greater than Start Date.");

            // Kiểm tra Status có giá trị hợp lệ trong enum LearningPathStatus
            RuleFor(x => x.LearningPathDto.Status)
                .IsInEnum()
                .WithMessage("Invalid Status value.");
        }
    }
}
