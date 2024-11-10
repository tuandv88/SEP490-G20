
namespace Community.Infrastructure.Data.Repositories.Categorys
{
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        private readonly IApplicationDbContext _dbContext;
        public CategoryRepository(IApplicationDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException();
        }

        public override async Task<Category?> GetByIdAsync(Guid id)
        {
            var categories = _dbContext.Categories
                            .AsEnumerable()
                            .FirstOrDefault(c => c.Id.Value == id);
            return categories;
        }

        public override async Task DeleteByIdAsync(Guid id)
        {
            var categories = await GetByIdAsync(id);
            if (categories != null)
            {
                _dbContext.Categories.Remove(categories);
            }
        }

        public async Task<Category?> GetByIdDetailAsync(Guid id)
        {
            return null;
        }

        public async Task<Category?> GetCategoryDetailByIdIsActiveAsync(Guid id)
        {
            // Lấy tất cả các bản ghi có IsActive = true từ database
            var category = _dbContext.Categories
                                     .Include(c => c.Discussions)
                                             .ThenInclude(d => d.Comments)
                                             .ThenInclude(c => c.Votes)
                                     .Include(c => c.Discussions)
                                             .ThenInclude(d => d.Votes)
                                     .Include(c => c.Discussions)
                                             .ThenInclude(d => d.Bookmarks)
                                     .Include(c => c.Discussions)
                                             .ThenInclude(d => d.UserDiscussions)
                                     .AsEnumerable()  // Chuyển truy vấn sang client-side để xử lý
                                     .FirstOrDefault(c => c.Id.Value == id && c.IsActive);

            return await Task.FromResult(category);
        }
    }
}







