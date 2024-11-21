namespace Community.Application.Models.Categories.Commands.RemoveCategoryById;

public class RemoveCategoryByIdHandler : ICommandHandler<RemoveCategoryByIdCommand, RemoveCategoryByIdResult>
{
    private readonly ICategoryRepository _categoryRepository;

    public RemoveCategoryByIdHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<RemoveCategoryByIdResult> Handle(RemoveCategoryByIdCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id);

        if (category == null)
        {
            throw new NotFoundException("Category not found.", request.Id);
        }

        await _categoryRepository.DeleteByIdAsync(request.Id);
        await _categoryRepository.SaveChangesAsync(cancellationToken);

        return new RemoveCategoryByIdResult(true);
    }
}