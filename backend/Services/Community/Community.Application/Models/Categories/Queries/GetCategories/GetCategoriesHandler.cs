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

    public async Task<GetCategoriesResult> Handle(GetCategoriesQuery query, CancellationToken cancellationToken) // Thực hiện xử lý khi nhận query GetCategoriesQuery
    {
        // Lấy toàn bộ danh sách Category từ database
        var allCategories = await _repository.GetAllAsync();

        // Chuyển đổi từng Category sang CategoryDto mà không cần filesService
        var categoryDtos = allCategories.Select(c => new CategoryDto(
            c.Id.Value,        // Gán Id của Category dưới dạng Guid
            c.Name,            // Gán tên của Category
            c.Description,     // Gán mô tả của Category
            c.IsActive         // Gán trạng thái hoạt động của Category
        )).ToList();

        // Trả về kết quả GetCategoriesResult với danh sách categoryDtos
        return new GetCategoriesResult(categoryDtos);
    }
}
