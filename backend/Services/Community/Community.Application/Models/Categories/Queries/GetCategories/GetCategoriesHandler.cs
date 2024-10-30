using Community.Application.Data.Repositories;
using Community.Application.Models.Categories.Dtos;
using Community.Application.Models.Categories.Queries.GetCategories;

public class GetCategoriesHandler : IQueryHandler<GetCategoriesQuery, GetCategoriesResult>
{
    private readonly ICategoryRepository _repository;

    public GetCategoriesHandler(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetCategoriesResult> Handle(GetCategoriesQuery query, CancellationToken cancellationToken)
    {
        // Lấy toàn bộ danh sách Category từ database
        var allCategories = await _repository.GetAllAsync();

        // Chuyển sang CategoryDto mà không cần filesService
        var categoryDtos = allCategories.Select(c => new CategoryDto(
            c.Id.Value,        // Id của Category dưới dạng Guid
            c.Name,            // Tên của Category
            c.Description,     // Mô tả của Category
            c.IsActive         // Trạng thái hoạt động của Category
        )).ToList();

        return new GetCategoriesResult(categoryDtos);
    }
}
