using Community.Application.Models.Categories.Dtos;

namespace Community.Application.Extensions;

public static class CategoryExtensions
{
    public static CategoryDto ToCategoryDto(this Category category)
    {
        return new CategoryDto(
            Id: category.Id.Value,
            Name: category.Name,
            Description: category.Description,
            IsActive: category.IsActive
        );
    }
}