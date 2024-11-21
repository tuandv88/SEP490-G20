using Learning.Application.Models.Submissions.Commands.CreateCodeExecute;
using Learning.Application.Models.Submissions.Dtos;
using Learning.Application.Models.TestCases.Dtos;

namespace Learning.Application.Models.Submissions.Commands.CreateSubmission;
public class CreateSubmissionHandler(IProblemRepository problemRepository, IProblemSubmissionRepository problemSubmissionRepository,
     IUserContextService userContext, ISender sender)
    : ICommandHandler<CreateSubmissionCommand, CreateSubmissionResult> {

    public async Task<CreateSubmissionResult> Handle(CreateSubmissionCommand request, CancellationToken cancellationToken) {
        var problem = await problemRepository.GetByIdDetailAsync(request.ProblemId);

        if (problem == null) {
            throw new NotFoundException(nameof(Problem), request.ProblemId);
        }
        var userId = userContext.User.Id;

        // lấy test case ở trong problem ra 
        var testCases = problem.TestCases.Select(tc => new TestCaseInputDto(tc.Inputs)).ToList();

        var codeExecute = await sender.Send(new CreateProblemCodeExecuteCommand(
            request.ProblemId, new CreateCodeExecuteDto(request.Submission.LanguageCode, request.Submission.SolutionCode, testCases)));

        var submissionId = ProblemSubmissionId.Of(Guid.NewGuid());
        var problemSubmission = ProblemSubmission.Create(
                submissionId,
                UserId.Of(userId),
                problem.Id,
                DateTime.UtcNow,
                request.Submission.SolutionCode,
                (LanguageCode)Enum.Parse(typeof(LanguageCode), request.Submission.LanguageCode),
                codeExecute.CodeExecuteDto.ExecutionTime,
                codeExecute.CodeExecuteDto.MemoryUsage,
                codeExecute.CodeExecuteDto.TestResults,
                codeExecute.CodeExecuteDto.Status,
                codeExecute.CodeExecuteDto.Token,
                codeExecute.CodeExecuteDto.RunTimeErrors,
                codeExecute.CodeExecuteDto.CompileErrors
            );

        problem.AddProblemSubmission(problemSubmission);

        await problemSubmissionRepository.AddAsync(problemSubmission);
        await problemSubmissionRepository.SaveChangesAsync(cancellationToken);

        var firstFailedTestCase = codeExecute.CodeExecuteDto.TestResults
            .FirstOrDefault(tr => !tr.IsPass);

        var totalTestCase = codeExecute.CodeExecuteDto.TestResults.Count;
        var testCasePass = codeExecute.CodeExecuteDto.TestResults.Count(tr => tr.IsPass);

        var responseDto = new SubmissionResponseDto(
            codeExecute.CodeExecuteDto.Token,
            codeExecute.CodeExecuteDto.RunTimeErrors,
            codeExecute.CodeExecuteDto.CompileErrors,
            codeExecute.CodeExecuteDto.ExecutionTime,
            codeExecute.CodeExecuteDto.MemoryUsage,
            firstFailedTestCase,
            codeExecute.CodeExecuteDto.Status,
            codeExecute.CodeExecuteDto.LanguageCode,
            totalTestCase,
            testCasePass
        );

        return new CreateSubmissionResult(submissionId.Value, responseDto);
    }

}

