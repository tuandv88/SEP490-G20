using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.ProblemSolutions.Dtos;
using Learning.Application.Models.TestCases.Dtos;
using Learning.Application.Models.TestScripts.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Problems.Commands.UpdateProblem;

[Authorize($"{PoliciesType.Administrator}")]
public record UpdateProblemCommand(Guid ProblemId, UpdateProblemDto Problem) : ICommand<UpdateProblemResult>;
public record UpdateProblemResult(bool IsSuccess);

public class UpdateProblemCommandValidator : AbstractValidator<UpdateProblemCommand> {
    public UpdateProblemCommandValidator() {
        RuleFor(x => x.Problem.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MinimumLength(3).WithMessage("Title must be at least 3 characters long.");

        RuleFor(x => x.Problem.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MinimumLength(10).WithMessage("Description must be at least 10 characters long.");

        RuleFor(x => x.Problem.ProblemType)
            .Must(BeAValidProblemType)
            .WithMessage("ProblemType must be a valid enum value.");

        RuleFor(x => x.Problem.DifficultyType)
            .Must(BeAValidDifficultyType)
            .WithMessage("DifficultyType must be a valid enum value.");

        RuleFor(x => x.Problem.CpuTimeLimit)
            .GreaterThan(0).WithMessage("CPU time limit must be greater than 0.");

        RuleFor(x => x.Problem.CpuExtraTime)
            .GreaterThanOrEqualTo(0).WithMessage("CPU extra time must be greater than or equal to 0.");

        RuleFor(x => x.Problem.MemoryLimit)
            .GreaterThan(0).WithMessage("Memory limit must be greater than 0.");

        RuleFor(x => x.Problem.StackLimit)
            .GreaterThan(0).WithMessage("Stack limit must be greater than 0.");

        RuleFor(x => x.Problem.MaxThread)
            .GreaterThanOrEqualTo(1).WithMessage("Max thread must be at least 1.");

        RuleFor(x => x.Problem.MaxFileSize)
            .GreaterThanOrEqualTo(0).WithMessage("Max file size must be greater than or equal to 0.");

        RuleFor(x => x.Problem.Testcripts)
            .NotEmpty().WithMessage("Test scripts are required.")
            .Must(x => x.Count > 0).WithMessage("At least one test script is required.");

        RuleForEach(x => x.Problem.Testcripts)
            .SetValidator(new UpdateTestScriptDtoValidator());

        RuleFor(x => x.Problem.TestCases)
            .NotEmpty().WithMessage("Test cases are required.")
            .Must(x => x.Count > 0).WithMessage("At least one test case is required.");

        RuleForEach(x => x.Problem.TestCases)
            .SetValidator(new UpdateTestCaseDtoValidator());

    }

    private bool BeAValidDifficultyType(string difficultyType) {
        return Enum.TryParse<DifficultyType>(difficultyType, out _);
    }

    private bool BeAValidProblemType(string problemType) {
        return Enum.TryParse<ProblemType>(problemType, out _);
    }
}

public class UpdateTestScriptDtoValidator : AbstractValidator<UpdateTestScriptDto> {
    public UpdateTestScriptDtoValidator() {
        RuleFor(x => x.FileName)
            .NotEmpty().WithMessage("File name is required.");

        RuleFor(x => x.Template)
            .NotEmpty().WithMessage("Template is required.");

        RuleFor(x => x.TestCode)
            .NotEmpty().WithMessage("Test code is required.");

        RuleFor(x => x.LanguageCode)
            .Must(BeAValidLanguageCode)
            .WithMessage("LanguageCode must be a valid enum value.");

        RuleFor(x => x.Solutions)
            .NotEmpty().WithMessage("At least one solution is required.");

        RuleForEach(x => x.Solutions)
            .SetValidator(new UpdateProblemSolutionDtoValidator());
    }
    private bool BeAValidLanguageCode(string languageCode) {
        return Enum.TryParse<LanguageCode>(languageCode, out _);
    }
}

public class UpdateProblemSolutionDtoValidator : AbstractValidator<UpdateProblemSolutionDto> {
    public UpdateProblemSolutionDtoValidator() {
        RuleFor(x => x.FileName)
            .NotEmpty().WithMessage("Solution file name is required.");

        RuleFor(x => x.SolutionCode)
            .NotEmpty().WithMessage("Solution code is required.");

        RuleFor(x => x.LanguageCode)
            .Must(BeAValidLanguageCode)
            .WithMessage("LanguageCode must be a valid enum value.");
    }
    private bool BeAValidLanguageCode(string languageCode) {
        return Enum.TryParse<LanguageCode>(languageCode, out _);
    }
}
public class UpdateTestCaseDtoValidator : AbstractValidator<UpdateTestCaseDto> {
    public UpdateTestCaseDtoValidator() {
        RuleFor(x => x.ExpectedOutput)
            .NotEmpty().WithMessage("Expected output is required.");

        RuleFor(x => x.OrderIndex)
            .GreaterThanOrEqualTo(0).WithMessage("Order index must be greater than or equal to 0.");
    }
}
