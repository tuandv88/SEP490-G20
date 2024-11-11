using Community.Application.Models.Categories.Dtos;
using Community.Domain.Models;
using Community.Domain.ValueObjects;

namespace Community.Application.Models.Categories.Commands.CreateCategory;

public class CreateCategoryHandler : ICommandHandler<CreateCategoryCommand, CreateCategoryResult>
{
    private readonly ICategoryRepository _categoryRepository;

    public CreateCategoryHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<CreateCategoryResult> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var category = CreateNewCategory(request.CreateCategoryDto);

            await _categoryRepository.AddAsync(category);
            await _categoryRepository.SaveChangesAsync(cancellationToken);

            return new CreateCategoryResult(category.Id.Value, true, "Category created successfully.");
        }
        catch (Exception ex)
        {
            return new CreateCategoryResult(null, false, $"Failed to create category: {ex.Message}");
        }
    }

    private Category CreateNewCategory(CreateCategoryDto createCategoryDto)
    {
        return Category.Create(
            categoryId: CategoryId.Of(Guid.NewGuid()),
            name: createCategoryDto.Name,
            description: createCategoryDto.Description,
            isActive: createCategoryDto.IsActive
        );
    }
}
