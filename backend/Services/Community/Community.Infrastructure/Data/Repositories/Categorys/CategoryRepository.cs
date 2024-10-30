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
    }
}







