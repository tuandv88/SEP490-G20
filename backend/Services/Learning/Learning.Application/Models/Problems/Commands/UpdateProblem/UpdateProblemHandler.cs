using Learning.Application.Exceptions;
using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.ProblemSolutions.Dtos;
using Learning.Application.Models.Submissions.Commands.CreateBatchCodeExcute;
using Learning.Application.Models.Submissions.Dtos.CodeExecution;
using Learning.Application.Models.TestCases.Dtos;

namespace Learning.Application.Models.Problems.Commands.UpdateProblem;
public class UpdateProblemHandler(IProblemRepository repository, ITestScriptRepository testScriptRepository,
    IProblemSolutionRepository problemSolutionRepository, ITestCaseRepository testCaseRepository, ISender sender
    ) : ICommandHandler<UpdateProblemCommand, UpdateProblemResult> {
    public async Task<UpdateProblemResult> Handle(UpdateProblemCommand request, CancellationToken cancellationToken) {
        var problem =await repository.GetByIdDetailAsync(request.ProblemId);
        if (problem == null) {
            throw new NotFoundException(nameof(Problem), request.ProblemId);
        }
        //TODO test code solution trước khi lưu vào database
        await ExecuteTestScripts(request.Problem);

        await UpdateProblem(problem, request.Problem);

        await repository.UpdateAsync(problem);
        await repository.SaveChangesAsync(cancellationToken);

        return new UpdateProblemResult(true);

    }

    private async Task ExecuteTestScripts(UpdateProblemDto updateProblemDto) {
        var testCases = updateProblemDto.TestCases.Select(x => new TestCaseDto(x.Inputs, x.ExpectedOutput)).ToList();

        foreach (var testScript in updateProblemDto.Testcripts) {
            var batchCodeExecuteResult = await sender.Send(new CreateBatchCodeExcuteCommand(
                new BatchCodeExecuteDto(
                    LanguageCode: testScript.LanguageCode,
                    TestCases: testCases,
                    SolutionCodes: testScript.Solutions.Select(x => x.SolutionCode).ToList(),
                    TestCode: testScript.TestCode
                )
            ));

            foreach (var codeExecuteDto in batchCodeExecuteResult.CodeExecuteDtos) {
                if (codeExecuteDto.Status.Id > 3) {
                    var errors = new List<string>();
                    if (!string.IsNullOrEmpty(codeExecuteDto.CompileErrors)) {
                        errors.Add($"Compiler Error: {codeExecuteDto.CompileErrors}");
                    }
                    if (!string.IsNullOrEmpty(codeExecuteDto.RunTimeErrors)) {
                        errors.Add($"Run Time Error: {codeExecuteDto.RunTimeErrors}");
                    }
                    throw new CodeExecutionException($"Code execution failed for script: {testScript.TestCode}. Errors: {string.Join("; ", errors)}");
                }
                var status = codeExecuteDto.TestResults.Any(t => t.IsPass == false);
                if (status) {
                    throw new TestCaseFailedException("Some test cases have not passed successfully. Please run the code before completing.");
                }
            }
        }
    }


    private async Task UpdateProblem(Problem problem, UpdateProblemDto problemDto) {
        problem.Update(
                title: problemDto.Title,
                description: problemDto.Description,
                problemType: (ProblemType)Enum.Parse(typeof(ProblemType), problemDto.ProblemType),
                difficultyType: (DifficultyType)Enum.Parse(typeof(DifficultyType), problemDto.DifficultyType),
                cpuTimeLimit: problemDto.CpuTimeLimit,
                cpuExtraTime: problemDto.CpuExtraTime,
                memoryLimit: problemDto.MemoryLimit,
                enableNetwork: problemDto.EnableNetwork,
                stackLimit: problemDto.StackLimit,
                maxThread: problemDto.MaxThread,
                maxFileSize: problemDto.MaxFileSize,
                isActive: problemDto.IsActive
            );
        await HandleTestScripts(problem, problemDto);

        await HandleProblemSolutions(problem, problemDto);

        await HandleTestCases(problem, problemDto);
    }

    private async Task HandleTestScripts(Problem problem, UpdateProblemDto problemDto) {
        var existingTestScripts = await testScriptRepository.GetByProblemIdAsync(problem.Id);

        // Update or Add TestScripts
        foreach (var dto in problemDto.Testcripts) {
            var languageCode = (LanguageCode)Enum.Parse(typeof(LanguageCode), dto.LanguageCode);
            if (dto.Id.HasValue) {
                var existingTestScript = existingTestScripts.FirstOrDefault(ts => ts.Id.Value == dto.Id.Value);
                if (existingTestScript != null) {
                    var testScript = problem.UpdateTestScript(existingTestScript.Id, dto.FileName, dto.Template, dto.TestCode, dto.Description, languageCode);
                    await testScriptRepository.UpdateAsync(testScript);
                }
            } else {
                // Create new TestScript
                var testScript = TestScript.Create(
                       Id: TestScriptId.Of(Guid.NewGuid()),
                       problemId: problem.Id,
                       fileName: dto.FileName,
                       template: dto.Template,
                       testCode: dto.TestCode,
                       description: dto.Description,
                       languageCode: languageCode);
                problem.AddTestScript(testScript);
                await testScriptRepository.AddAsync(testScript);

            }
        }
        // Delete TestScripts không có trong data gửi lên
        var dtoIds = problemDto.Testcripts.Where(dto => dto.Id.HasValue).Select(dto => dto.Id!.Value).ToList();
        var testScriptsToDelete = existingTestScripts.Where(ts => !dtoIds.Contains(ts.Id.Value)).ToList();
        foreach (var ts in testScriptsToDelete) {
            problem.RemoveTestScript(ts);
            await testScriptRepository.DeleteAsync(ts);
        }
    }
    private async Task HandleProblemSolutions(Problem problem, UpdateProblemDto problemDto) {
        var existingSolutions = await problemSolutionRepository.GetByProblemIdAsync(problem.Id);
        var problemSolutionDto = new List<UpdateProblemSolutionDto>();
        problemDto.Testcripts.ForEach(t => {
            problemSolutionDto.AddRange(t.Solutions);
        });
        // Update or Add ProblemSolutions
        foreach (var dto in problemSolutionDto) {
            var languageCode = (LanguageCode)Enum.Parse(typeof(LanguageCode), dto.LanguageCode);
            if (dto.Id.HasValue) {
                var existingSolution = existingSolutions.FirstOrDefault(s => s.Id.Value == dto.Id.Value);
                if (existingSolution != null) {
                    // Update properties
                    var problemSolution = problem.UpdateProblemSolution(existingSolution.Id, dto.FileName,
                                            dto.SolutionCode, dto.Description, languageCode, dto.Priority);

                    await problemSolutionRepository.UpdateAsync(problemSolution);
                }
            } else {
                var problemSolution = ProblemSolution.Create(ProblemSolutionId.Of(Guid.NewGuid()), problem.Id,
                        dto.FileName, dto.SolutionCode, dto.Description, languageCode, dto.Priority);
                problem.AddProblemSolution(problemSolution);
                await problemSolutionRepository.AddAsync(problemSolution);
            }
        }

        // Delete ProblemSolutions not present in DTO
        var dtoIds = problemSolutionDto.Where(dto => dto.Id.HasValue).Select(dto => dto.Id!.Value).ToList();
        var solutionsToDelete = existingSolutions.Where(s => !dtoIds.Contains(s.Id.Value)).ToList();
        foreach (var sol in solutionsToDelete) {
            problem.RemoveProblemSolution(sol);
            await problemSolutionRepository.DeleteAsync(sol);
        }
    }
    private async Task HandleTestCases(Problem problem, UpdateProblemDto problemDto) {
        var existingTestCases = await testCaseRepository.GetByProblemIdAsync(problem.Id);

        // Update or Add TestCases
        foreach (var dto in problemDto.TestCases) {
            if (dto.Id.HasValue) {
                var existingTestCase = existingTestCases.FirstOrDefault(tc => tc.Id.Value == dto.Id.Value);
                if (existingTestCase != null) {

                    var testCase = problem.UpdateTestCase(existingTestCase.Id, dto.Inputs, dto.ExpectedOutput, 
                                                        dto.IsHidden, dto.OrderIndex);
                    await testCaseRepository.UpdateAsync(testCase);
                }
            } else {
                // Create new TestCase
                var testCase = TestCase.Create(TestCaseId.Of(Guid.NewGuid()), problem.Id, dto.Inputs, dto.ExpectedOutput, 
                                                dto.IsHidden, dto.OrderIndex);
                problem.AddTestCase(testCase);
                await testCaseRepository.AddAsync(testCase);
            }
        }

        // Delete TestCases not present in DTO
        var dtoIds = problemDto.TestCases.Where(dto => dto.Id.HasValue).Select(dto => dto.Id!.Value).ToList();
        var testCasesToDelete = existingTestCases.Where(tc => !dtoIds.Contains(tc.Id.Value)).ToList();
        foreach (var tc in testCasesToDelete) {
            problem.RemoveTestCase(tc);
            await testCaseRepository.DeleteAsync(tc);
        }
    }
}

