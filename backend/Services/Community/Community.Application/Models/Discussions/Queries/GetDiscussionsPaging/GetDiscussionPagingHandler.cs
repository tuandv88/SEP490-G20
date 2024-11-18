using Community.Application.Models.Discussions.Dtos;
using Community.Application.Extensions;

namespace Community.Application.Models.Discussions.Queries.GetDiscussionsPaging;

public class GetDiscussionsPagingHandler : IQueryHandler<GetDiscussionsPagingQuery, GetDiscussionsPagingResult>
{
    private readonly IDiscussionRepository _repository;
    private readonly IFilesService _filesService;

    public GetDiscussionsPagingHandler(IDiscussionRepository repository, IFilesService filesService)
    {
        _repository = repository;
        _filesService = filesService;
    }

    public async Task<GetDiscussionsPagingResult> Handle(GetDiscussionsPagingQuery query, CancellationToken cancellationToken)
    {
        var allData = await _repository.GetAllAsync();

        // Lấy thông tin phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        var totalCount = allData.Count();

        var discussions = allData.OrderBy(c => c.DateCreated)
                            .Skip(pageSize * (pageIndex - 1))
                            .Take(pageSize)
                            .ToList();

        // Sử dụng ToDiscussionDtoListAsync để chuyển đổi sang DTO
        var discussionDtos = await discussions.ToDiscussionDtoListAsync(_filesService);

        var discussionPaginateData = new PaginatedResult<DiscussionDto>(pageIndex, pageSize, totalCount, discussionDtos);

        return new GetDiscussionsPagingResult(discussionPaginateData);
    }
}
