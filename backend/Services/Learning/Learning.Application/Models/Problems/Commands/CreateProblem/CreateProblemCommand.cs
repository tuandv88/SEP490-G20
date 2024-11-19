using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.ProblemSolutions.Dtos;
using Learning.Application.Models.TestCases.Dtos;
using Learning.Application.Models.TestScripts.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Problems.Commands.CreateProblem;

[Authorize(Roles = $"{RoleType.Administrator}")]
public record CreateProblemCommand : ICommand<CreateProblemResult> {
    public Guid? LectureId;
    public required CreateProblemDto CreateProblemDto;
}
public record CreateProblemResult(Guid Id);

public class CreateProblemCommandValidator : AbstractValidator<CreateProblemCommand> {
    public CreateProblemCommandValidator() {
        RuleFor(x => x.CreateProblemDto.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MinimumLength(3).WithMessage("Title must be at least 3 characters long.");

        RuleFor(x => x.CreateProblemDto.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MinimumLength(10).WithMessage("Description must be at least 10 characters long.");

        RuleFor(x => x.CreateProblemDto.ProblemType)
            .Must(BeAValidProblemType)
            .WithMessage("ProblemType must be a valid enum value.");

        RuleFor(x => x.CreateProblemDto.DifficultyType)
            .Must(BeAValidDifficultyType)
            .WithMessage("DifficultyType must be a valid enum value.");

        RuleFor(x => x.CreateProblemDto.CpuTimeLimit)
            .GreaterThan(0).WithMessage("CPU time limit must be greater than 0.");

        RuleFor(x => x.CreateProblemDto.CpuExtraTime)
            .GreaterThanOrEqualTo(0).WithMessage("CPU extra time must be greater than or equal to 0.");

        RuleFor(x => x.CreateProblemDto.MemoryLimit)
            .GreaterThan(0).WithMessage("Memory limit must be greater than 0.");

        RuleFor(x => x.CreateProblemDto.StackLimit)
            .GreaterThan(0).WithMessage("Stack limit must be greater than 0.");

        RuleFor(x => x.CreateProblemDto.MaxThread)
            .GreaterThanOrEqualTo(1).WithMessage("Max thread must be at least 1.");

        RuleFor(x => x.CreateProblemDto.MaxFileSize)
            .GreaterThanOrEqualTo(0).WithMessage("Max file size must be greater than or equal to 0.");

        RuleFor(x => x.CreateProblemDto.CreateTestScriptDto)
            .NotEmpty().WithMessage("Test scripts are required.")
            .Must(x => x.Count > 0).WithMessage("At least one test script is required.");

        RuleForEach(x => x.CreateProblemDto.CreateTestScriptDto)
            .SetValidator(new CreateTestScriptDtoValidator());

        RuleFor(x => x.CreateProblemDto.TestCases)
            .NotEmpty().WithMessage("Test cases are required.")
            .Must(x => x.Count > 0).WithMessage("At least one test case is required.");

        RuleForEach(x => x.CreateProblemDto.TestCases)
            .SetValidator(new CreateTestCaseDtoValidator());

        RuleFor(x => x.CreateProblemDto.ProblemType)
            .Equal("Practice")
            .When(x => x.LectureId != null)
            .WithMessage("ProblemType must be 'Practice' if LectureId is provided.");

        RuleFor(x => x.CreateProblemDto.ProblemType)
            .NotEqual(ProblemType.Practice.ToString())
            .When(x => x.LectureId == null)
            .WithMessage("ProblemType must be 'Assessment' or 'Challenge' if LectureId is null.");

    }

    private bool BeAValidDifficultyType(string difficultyType) {
        return Enum.TryParse<DifficultyType>(difficultyType, out _);
    }

    private bool BeAValidProblemType(string problemType) {
        return Enum.TryParse<ProblemType>(problemType, out _);
    }
}

public class CreateTestScriptDtoValidator : AbstractValidator<CreateTestScriptDto> {
    public CreateTestScriptDtoValidator() {
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
            .SetValidator(new CreateProblemSolutionDtoValidator());
    }
    private bool BeAValidLanguageCode(string languageCode) {
        return Enum.TryParse<LanguageCode>(languageCode, out _);
    }
}

public class CreateProblemSolutionDtoValidator : AbstractValidator<CreateProblemSolutionDto> {
    public CreateProblemSolutionDtoValidator() {
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
public class CreateTestCaseDtoValidator : AbstractValidator<CreateTestCaseDto> {
    public CreateTestCaseDtoValidator() {
        RuleFor(x => x.ExpectedOutput)
            .NotEmpty().WithMessage("Expected output is required.");

        RuleFor(x => x.OrderIndex)
            .GreaterThanOrEqualTo(0).WithMessage("Order index must be greater than or equal to 0.");
    }
}

