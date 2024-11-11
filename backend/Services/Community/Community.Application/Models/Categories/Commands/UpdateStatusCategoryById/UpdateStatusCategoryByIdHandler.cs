using Community.Application.Models.Comments.Commands.UpdateStatusComment;

namespace Community.Application.Models.Categories.Commands.UpdateStatusCategoryById;

public class UpdateStatusCategoryByIdHandler : ICommandHandler<UpdateStatusCategoryByIdCommand, UpdateStatusCategoryByIdResult>
{
    private readonly ICategoryRepository _repository;

    public UpdateStatusCategoryByIdHandler(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<UpdateStatusCategoryByIdResult> Handle(UpdateStatusCategoryByIdCommand request, CancellationToken cancellationToken)
    {
        var category = await _repository.GetByIdAsync(request.Id);

        if (category == null)
        {
            throw new NotFoundException("Category not found.", request.Id);
        }

        // Chuyển đổi trạng thái IsActive
        category.IsActive = !category.IsActive;

        await _repository.UpdateAsync(category);
        await _repository.SaveChangesAsync(cancellationToken);

        return new UpdateStatusCategoryByIdResult(true, category.IsActive);
    }
}
