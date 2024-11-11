using Community.Application.Extensions;
using Community.Application.Models.Categories.Dtos;
using Community.Application.Models.Categories.Queries.GetCategories;

// Định nghĩa một handler ( Làm việc với Interface ) - để xử lí cho query GetCategoriesQuery
public class GetCategoriesHandler : IQueryHandler<GetCategoriesQuery, GetCategoriesResult>
{
    // Repository để làm việc với dữ liệu Category từ database
    private readonly ICategoryRepository _repository; 

    public GetCategoriesHandler(ICategoryRepository repository) // Constructor nhận vào ICategoryRepository từ Dependency Injection
    {
        _repository = repository; // Gán repository được truyền vào cho field _repository
    }

    public async Task<GetCategoriesResult> Handle(GetCategoriesQuery query, CancellationToken cancellationToken)
    {
        var allCategories = await _repository.GetAllAsync();

        // Dùng phương thức mở rộng để chuyển đổi sang DTO
        var categoryDtos = allCategories.Select(c => c.ToCategoryDto()).ToList();

        // Trả về kết quả GetCategoriesResult với danh sách categoryDtos
        return new GetCategoriesResult(categoryDtos);

    }
}
