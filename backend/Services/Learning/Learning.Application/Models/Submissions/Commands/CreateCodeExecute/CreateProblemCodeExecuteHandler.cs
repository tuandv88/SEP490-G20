using Learning.Application.Models.Submissions.Commands.CreateBatchCodeExcute;
using Learning.Application.Models.Submissions.Dtos.CodeExecution;
using Learning.Application.Models.TestCases.Dtos;

namespace Learning.Application.Models.Submissions.Commands.CreateCodeExecute;

public class CreateProblemCodeExecuteHandler(IProblemRepository problemRepository, ISender sender) : ICommandHandler<CreateProblemCodeExecuteCommand, CreateProblemCodeExecuteResult> {
    public async Task<CreateProblemCodeExecuteResult> Handle(CreateProblemCodeExecuteCommand request, CancellationToken cancellationToken) {
        var problem = await problemRepository.GetByIdDetailAsync(request.ProblemId);
        if (problem == null) {
            throw new NotFoundException("Problem", request.ProblemId);
        }

        var codeExecuteDto = await ExecuteTestScripts(request.CreateCodeExecuteDto, problem);
        return new CreateProblemCodeExecuteResult(codeExecuteDto);
    }

    private async Task<CodeExecuteDto> ExecuteTestScripts(CreateCodeExecuteDto createCodeExecuteDto, Problem problem) {
        var languageCode = createCodeExecuteDto.LanguageCode;

        var trustSolutionCode = problem.ProblemSolutions.FirstOrDefault(
                                p => p.Priority &&
                                p.LanguageCode.ToString().Equals(languageCode));


        //code người dùng trước, source code hệ thống sau 
        var solutionCodes = new List<string>() { createCodeExecuteDto.SolutionCode, trustSolutionCode!.SolutionCode};

        var testScript = problem.TestScripts.FirstOrDefault(t => t.LanguageCode.ToString().Equals(languageCode));

        var testCases = createCodeExecuteDto.TestCases.Select(t => new TestCaseDto(t.Inputs, "")).ToList();

        var batchCodeExecuteResult = await sender.Send(new CreateBatchCodeExcuteCommand(
            new BatchCodeExecuteDto(
                LanguageCode: languageCode,
                TestCases: testCases,
                SolutionCodes: solutionCodes,
                TestCode: testScript!.TestCode
            )
        ));
        var userCodeResult = batchCodeExecuteResult.CodeExecuteDtos[0];
        var systemCodeResult = batchCodeExecuteResult.CodeExecuteDtos[1];

        if (userCodeResult.Status.Id > 3) {
            return userCodeResult;
        }

        var updatedTestResults = new List<TestResult>();

        for (int i = 0; i < userCodeResult.TestResults.Count; i++) {
            var userTestResult = userCodeResult.TestResults[i];
            var systemTestResult = systemCodeResult.TestResults[i];
            //Đặt output trả về của hệ thống làm expected của người dùng
            var updatedTestResult = userTestResult with {
                Expected = systemTestResult.Output,
                IsPass = userTestResult.Output == systemTestResult.Output
            };

            updatedTestResults.Add(updatedTestResult);
        }
        var updatedUserCodeResult = userCodeResult with { TestResults = updatedTestResults };

        return updatedUserCodeResult;

    }
}

