using Community.Application.Models.Categories.Dtos;
using Community.Domain.Models;
using Community.Domain.ValueObjects;

namespace Community.Application.Models.Categories.Commands.UpdateCategory
{
    public class UpdateCategoryHandler : ICommandHandler<UpdateCategoryCommand, UpdateCategoryResult>
    {
        private readonly ICategoryRepository _categoryRepository;

        public UpdateCategoryHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<UpdateCategoryResult> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _categoryRepository.GetByIdAsync(request.UpdateCategoryDto.Id);

            if (category == null)
            {
                return new UpdateCategoryResult(false, "Category not found.");
            }

            UpdateCategoryWithNewValues(category, request.UpdateCategoryDto);

            await _categoryRepository.UpdateAsync(category);
            await _categoryRepository.SaveChangesAsync(cancellationToken);

            return new UpdateCategoryResult(true, "Category updated successfully.");
        }

        private void UpdateCategoryWithNewValues(Category category, UpdateCategoryDto updateCategoryDto)
        {
            category.Update(
                name: updateCategoryDto.Name,
                description: updateCategoryDto.Description,
                isActive: updateCategoryDto.IsActive
            );
        }
    }
}
