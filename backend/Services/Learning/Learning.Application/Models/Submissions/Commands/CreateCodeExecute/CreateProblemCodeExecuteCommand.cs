using Learning.Application.Models.Submissions.Dtos.CodeExecution;

namespace Learning.Application.Models.Submissions.Commands.CreateCodeExecute;
public record CreateProblemCodeExecuteCommand(Guid ProblemId, CreateCodeExecuteDto CreateCodeExecuteDto) : ICommand<CreateProblemCodeExecuteResult>;
public record CreateProblemCodeExecuteResult(CodeExecuteDto CodeExecuteDto);