using Community.Application.Models.Categories.Dtos;

namespace Community.Application.Models.Categories.Queries.GetCategoryById;

public record GetCategoryByIdResult(CategoryDto CategoryDto);

public record GetCategoryByIdQuery(Guid Id) : IQuery<GetCategoryByIdResult>;
