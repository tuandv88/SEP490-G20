using Learning.Application.Models.Submissions.Dtos;

namespace Learning.Application.Models.Submissions.Commands.CreateSubmission;

public record CreateSubmissionCommand(SubmissionDto SubmissionDto) : ICommand<CreateSubmissionResult>;
public record CreateSubmissionResult(SubmissionResponse SubmissionResponse);
public class CreateSubmissionCommandValidator : AbstractValidator<CreateSubmissionCommand>
{
    public CreateSubmissionCommandValidator()
    {
        //Validate
        RuleFor(s => s.SubmissionDto.ProblemId).NotEmpty().WithMessage("ProblemId is required");
        RuleFor(s => s.SubmissionDto.LanguageId).NotEmpty().WithMessage("LanguageId is required");
        RuleFor(s => s.SubmissionDto.SourceCode).NotEmpty().WithMessage("SourceCode is required");
    }
}