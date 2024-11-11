namespace Community.Application.Models.Categories.Commands.UpdateStatusCategoryById;
public record UpdateStatusCategoryByIdResult(bool IsSuccess, bool NewStatus);
public record UpdateStatusCategoryByIdCommand(Guid Id) : ICommand<UpdateStatusCategoryByIdResult>;