using Learning.Application.Data.Repositories;
using Learning.Application.Exceptions;
using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.Submissions.Commands.CreateBatchCodeExcute;
using Learning.Application.Models.Submissions.Dtos.CodeExecution;
using Learning.Application.Models.TestCases.Dtos;
using Learning.Domain.Enums;
using Learning.Domain.ValueObjects;
using MediatR;
namespace Learning.Application.Models.Problems.Commands.CreateProblem;
public class CreateProblemHandler(ILectureRepository lectureRepository, IProblemRepository problemRepository, ISender sender)
    : ICommandHandler<CreateProblemCommand, CreateProblemResult> {
    public async Task<CreateProblemResult> Handle(CreateProblemCommand request, CancellationToken cancellationToken) {
        Lecture? lecture = null;
        if (request.LectureId.HasValue) {
            lecture = await lectureRepository.GetByIdAsync(request.LectureId.Value);
            if (lecture == null) {
                throw new NotFoundException("Lecture", request.LectureId.Value);
            }
            if (lecture.ProblemId != null) {
                throw new ConflictException("Lecture has problem.");
            }
        }
        //TODO test code solution trước khi lưu vào database
        await ExecuteTestScripts(request.CreateProblemDto);
        var problem = CreateNewProblem(request.CreateProblemDto);
        if (lecture != null) {
            lecture.ProblemId = problem.Id;
        }
        await problemRepository.AddAsync(problem);
        await problemRepository.SaveChangesAsync(cancellationToken);

        return new CreateProblemResult(problem.Id.Value);
    }

    private async Task ExecuteTestScripts(CreateProblemDto createProblemDto) {
        var testCases = createProblemDto.TestCases.Select(x => new TestCaseDto(x.Inputs, x.ExpectedOutput)).ToList();

        foreach (var testScript in createProblemDto.CreateTestScriptDto) {
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
    private Problem CreateNewProblem(CreateProblemDto createProblemDto) {
        var problemId = ProblemId.Of(Guid.NewGuid());
        var problem = Problem.Create(
                        problemId: problemId,
                        title: createProblemDto.Title,
                        description: createProblemDto.Description,
                        problemType: (ProblemType)Enum.Parse(typeof(ProblemType), createProblemDto.ProblemType),
                        difficultyType: (DifficultyType)Enum.Parse(typeof(DifficultyType), createProblemDto.DifficultyType),
                        cpuTimeLimit: createProblemDto.CpuTimeLimit,
                        cpuExtraTime: createProblemDto.CpuExtraTime,
                        memoryLimit: createProblemDto.MemoryLimit,
                        enableNetwork: createProblemDto.EnableNetwork,
                        stackLimit: createProblemDto.StackLimit,
                        maxThread: createProblemDto.MaxThread,
                        maxFileSize: createProblemDto.MaxFileSize,
                        isActive: createProblemDto.IsActive
                        );
        var problemSolutions = new List<ProblemSolution>();
        var testScripts = new List<TestScript>();
        foreach (var testScriptDto in createProblemDto.CreateTestScriptDto) {
            var testScript = new TestScript() {
                Id = TestScriptId.Of(Guid.NewGuid()),
                ProblemId = problem.Id,
                FileName = testScriptDto.FileName,
                Template = testScriptDto.Template,
                TestCode = testScriptDto.TestCode,
                Description = testScriptDto.Description,
                LanguageCode = (LanguageCode)Enum.Parse(typeof(LanguageCode), testScriptDto.LanguageCode)
            };
            testScripts.Add(testScript);


            var mapToProblemSolution = testScriptDto.Solutions.Select(s => new ProblemSolution() {
                Id = ProblemSolutionId.Of(Guid.NewGuid()),
                ProblemId = problem.Id,
                FileName = s.FileName,
                SolutionCode = s.SolutionCode,
                Description = s.Description,
                LanguageCode = (LanguageCode)Enum.Parse(typeof(LanguageCode), s.LanguageCode),
                Priority = s.Priority,
            }).ToList();
            problemSolutions.AddRange(mapToProblemSolution);
        }

        problem.AddProblemSolution(problemSolutions);
        problem.AddTestScript(testScripts);

        var testCases = createProblemDto.TestCases.Select(t => new TestCase() {
            Id = TestCaseId.Of(Guid.NewGuid()),
            ProblemId = problem.Id,
            Inputs = t.Inputs,
            ExpectedOutput = t.ExpectedOutput,
            IsHidden = t.IsHidden,
            OrderIndex = t.OrderIndex
        }).ToList();
        problem.AddTestCase(testCases);

        return problem;
    }

}
