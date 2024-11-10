using Community.Application.Extensions;
using Community.Application.Models.Comments.Queries.GetCommentDetailById;

namespace Community.Application.Models.Categories.Queries.GetCategoryById
{
    public class GetCategoryByIdHandler : IQueryHandler<GetCategoryByIdQuery, GetCategoryByIdResult>
    {
        private readonly ICategoryRepository _repository;

        public GetCategoryByIdHandler(ICategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<GetCategoryByIdResult> Handle(GetCategoryByIdQuery query, CancellationToken cancellationToken)
        {
            var category = await _repository.GetByIdAsync(query.Id);

            if (category == null)
            {
                return new GetCategoryByIdResult(null);
            }

            var categoryDto = category.ToCategoryDto();

            return new GetCategoryByIdResult(categoryDto);
        }
    }
}
