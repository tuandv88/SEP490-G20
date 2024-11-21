using Learning.Application.Models.Submissions.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Submissions.Commands.CreateSubmission;

[Authorize]
public record CreateSubmissionCommand(Guid ProblemId, SubmissionCodeDto Submission) : ICommand<CreateSubmissionResult>;
public record CreateSubmissionResult(Guid SubmissionId, SubmissionResponseDto SubmissionResponse);
public class CreateSubmissionCommandValidator : AbstractValidator<CreateSubmissionCommand> {
    public CreateSubmissionCommandValidator() {
        RuleFor(command => command.Submission.LanguageCode)
            .NotEmpty()
            .WithMessage("LanguageCode is required.")
            .Must(BeAValidLanguageCode)
            .WithMessage("LanguageCode must be a valid programming language.");
    }
    private bool BeAValidLanguageCode(string languageCode) {
        return Enum.TryParse(languageCode, true, out LanguageCode parsedLanguageCode) && Enum.IsDefined(typeof(LanguageCode), parsedLanguageCode);
    }
}