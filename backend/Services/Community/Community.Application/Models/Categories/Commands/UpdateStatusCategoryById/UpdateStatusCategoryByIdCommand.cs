namespace Community.Application.Models.Categories.Commands.UpdateStatusCategoryById;
public record UpdateStatusCategoryByIdResult(bool IsSuccess, bool NewStatus);
[Authorize($"{PoliciesType.Administrator}")]
public record UpdateStatusCategoryByIdCommand(Guid Id) : ICommand<UpdateStatusCategoryByIdResult>;