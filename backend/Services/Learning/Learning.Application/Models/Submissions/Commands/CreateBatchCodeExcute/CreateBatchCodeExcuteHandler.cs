using Learning.Application.Models.Submissions.Dtos;
using Learning.Application.Models.TestCases.Dtos;

namespace Learning.Application.Models.Submissions.Commands.CreateBatchCodeExcute;
public class CreateBatchCodeExcuteHandler(ISubmissionService submissionService, ISourceCombiner sourceCombiner) : ICommandHandler<CreateBatchCodeExcuteCommand, CreateBatchCodeExcuteResult> {
    private const int DelayMilliseconds = 200;
    private const int MaxAttempts = 100;
    public async Task<CreateBatchCodeExcuteResult> Handle(CreateBatchCodeExcuteCommand request, CancellationToken cancellationToken) {
        // lấy ra tất cả test case gửi lên, mỗi param trong một test case là một hàng
        var allTestCaseInputs = string.Join("\n", request.BatchCodeExecuteDto.TestCases
                                .Select(testCase => string.Join("\n", testCase.Inputs.Values))
                                .ToList());

        Enum.TryParse<LanguageCode>(request.BatchCodeExecuteDto.LanguageCode, out var LanguageCode);
        //Tạo batch submission
        var submissionBatch = new SubmissionBatch() {
            Submissions = request.BatchCodeExecuteDto.SolutionCodes
                                    .Select(solutionCode => {
                                        var combieCode = sourceCombiner.MergeSourceCodesJava(request.BatchCodeExecuteDto.TestCode, solutionCode);
                                        return new Submission(combieCode, (int)LanguageCode) {
                                            Stdin = allTestCaseInputs,
                                            CpuTimeLimit = request.ResourceLimits.CpuTimeLimit,
                                            CpuExtraTime = request.ResourceLimits.CpuExtraTime,
                                            MemoryLimit = request.ResourceLimits.MemoryLimit,
                                            EnableNetwork = request.ResourceLimits.EnableNetwork,
                                            StackLimit = request.ResourceLimits.StackLimit,
                                            MaxProcessesAndOrThreads = request.ResourceLimits.MaxThread,
                                            MaxFileSize = request.ResourceLimits.MaxFileSize
                                        };
                                    })
                                    .ToList()
        };

        //Tạo batch solution
        var batchSubmissionReponses = await submissionService.CreateBatchAsync(submissionBatch);

        //Lấy ra token vừa tạo xong
        var tokens = batchSubmissionReponses.Select(sr => sr.Token).ToArray();

        List<SubmissionResponse> submissionsDone = new List<SubmissionResponse>();
        int attempts = 0;

        //Check liên tục chờ kết quả
        while (attempts < MaxAttempts) {
            var submissions = await submissionService.GetBatchAsync(tokens, true);
            submissionsDone = submissions.Submissions.Where(x => tokens.Contains(x.Token) && x.Status!.Id >= 3).ToList();
            if (submissionsDone.Count == tokens.Count()) {
                break;
            }

            attempts++;
            await Task.Delay(DelayMilliseconds, cancellationToken);
        }
        //sắp xếp lại thứ tự kết quả trả về 
        submissionsDone = tokens
            .Select(token => submissionsDone.FirstOrDefault(s => s.Token == token))
            .Where(s => s != null)
            .ToList()!;
        //Map sang Dto
        var lsCodeExecuteDtos = submissionsDone.ToCodeExecuteDto(LanguageCode.ToString());

        //Thêm các data Input, ExpectedOutput và Check pass
        var addData = AddData(lsCodeExecuteDtos, request.BatchCodeExecuteDto.TestCases);
        return new CreateBatchCodeExcuteResult(addData);
    }

    private List<CodeExecuteDto> AddData(List<CodeExecuteDto> lsCodeExecuteDtos, List<TestCaseDto> testCases) {
        bool CheckIfOutputMatchesExpected(string? output, string? expected) => output == expected;

        var addData = lsCodeExecuteDtos.Select(x => new CodeExecuteDto(
            Token: x.Token,
            RunTimeErrors: x.RunTimeErrors,
            CompileErrors: x.CompileErrors,
            ExecutionTime: x.ExecutionTime,
            MemoryUsage: x.MemoryUsage,
            TestResults: x.TestResults.Zip(testCases, (result, testCase) => new TestResult(
                Inputs: testCase.Inputs,
                Output: result.Output,
                Stdout: result.Stdout,
                Expected: testCase.ExpectedOutput,
                IsPass: CheckIfOutputMatchesExpected(result.Output, testCase.ExpectedOutput)
            )).ToList(),
            Status: x.Status,
            LanguageCode: x.LanguageCode
        )).ToList();

        return addData;
    }


}

