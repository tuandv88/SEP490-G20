namespace Learning.Application.Models.Submissions.Commands.CreateCodeExecute;

public class CreateCodeExecuteHandler : ICommandHandler<CreateCodeExecuteCommand, CreateCodeExecuteResult> {
    public Task<CreateCodeExecuteResult> Handle(CreateCodeExecuteCommand request, CancellationToken cancellationToken) {
        throw new NotImplementedException();
    }
}

