using Learning.Application.Models.Submissions.Dtos.CodeExecution;

namespace Learning.Application.Models.Submissions.Commands.CreateCodeExecute;
public record CreateCodeExecuteCommand(CreateCodeExecuteDto CreateCodeExecuteDto) : ICommand<CreateCodeExecuteResult>;
public record CreateCodeExecuteResult(CodeExecuteDto CodeExecuteDto);