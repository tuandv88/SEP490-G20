using BuildingBlocks.Caching;
using Community.Infrastructure.Constants;

namespace Community.Infrastructure.Data.Repositories.Categorys;

public class CachedCategoryRepository : ICategoryRepository
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly ICacheService _cacheService;

    public CachedCategoryRepository(ICategoryRepository categoryRepository, ICacheService cacheService)
    {
        _categoryRepository = categoryRepository;
        _cacheService = cacheService;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        int number = await _categoryRepository.SaveChangesAsync(cancellationToken);
        return number;
    }

    private void DeleteCached(string cachedKey)
    {
        _ = _cacheService.DeleteAsync(cachedKey);
    }

    public async Task AddAsync(Category entity)
    {
        await _categoryRepository.AddAsync(entity);
        //Xóa cached
        DeleteCached(CacheKey.COMMUNITY_CATEGORIES);
    }

    public async Task UpdateAsync(Category entity)
    {
        await _categoryRepository.UpdateAsync(entity);
        //Xóa cached
        DeleteCached(CacheKey.COMMUNITY_CATEGORIES);
        DeleteCached(string.Format(CacheKey.COMMUNITY_CATEGORIES_DETAILS, entity.Id.Value));
    }

    public async Task DeleteAsync(Category entity)
    {
        await _categoryRepository.DeleteAsync(entity);
        //Xóa cached
        DeleteCached(CacheKey.COMMUNITY_CATEGORIES);
        DeleteCached(string.Format(CacheKey.COMMUNITY_CATEGORIES_DETAILS, entity.Id.Value));
    }


    public async Task DeleteByIdAsync(Guid id)
    {
        await _categoryRepository.DeleteByIdAsync(id);
        //Xóa cached
        DeleteCached(CacheKey.COMMUNITY_CATEGORIES);
        DeleteCached(string.Format(CacheKey.COMMUNITY_CATEGORIES_DETAILS, id));
    }

    public async Task<List<Category>> GetAllAsync()
    {
        var cachedKey = CacheKey.COMMUNITY_CATEGORIES;

        // Lấy dữ liệu từ cache
        var cachedData = await _cacheService.GetAsync<List<Category>>(cachedKey);

        if (cachedData == null || !cachedData.Any())
        {
            // Lấy dữ liệu từ database
            var allData = await _categoryRepository.GetAllAsync();

            _ = _cacheService.SetAsync(cachedKey, allData);

            return allData;
        }
        else
        {
            return cachedData;
        }
    }


    public async Task<Category?> GetByIdAsync(Guid id)
    {
        var allData = await GetAllAsync();
        var category = allData.Where(c => c.Id.Value == id).FirstOrDefault();
        return category;
    }

    public async Task<Category?> GetByIdDetailAsync(Guid id)
    {
        // Tạo khóa cache riêng cho Category theo ID
        var cachedKey = string.Format(CacheKey.COMMUNITY_CATEGORIES_DETAILS, id);

        // Kiểm tra trong cache xem dữ liệu chi tiết của Category này đã có chưa
        var allData = await _cacheService.GetAsync<Category>(cachedKey);

        if (allData == null) // Nếu cache không có dữ liệu
        {
            // Lấy dữ liệu từ database
            allData = await _categoryRepository.GetByIdDetailAsync(id);

            // Lưu dữ liệu vào cache để lần sau truy cập nhanh hơn
            _ = _cacheService.SetAsync(cachedKey, allData);
        }

        // Trả về dữ liệu từ cache hoặc database
        return allData;
    }

    public async Task<Category?> GetCategoryDetailByIdIsActiveAsync(Guid id)
    {
        // Truy vấn dữ liệu trực tiếp từ database thông qua repository
        var allData = await _categoryRepository.GetCategoryDetailByIdIsActiveAsync(id);

        // Trả về dữ liệu từ database
        return allData;
    }

}
