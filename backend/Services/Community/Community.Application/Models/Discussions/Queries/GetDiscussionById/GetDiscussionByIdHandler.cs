using Community.Application.Extensions;
using Community.Application.Models.Discussions.Queries.GetDiscussionById;

public class GetDiscussionByIdHandler : IQueryHandler<GetDiscussionByIdQuery, GetDiscussionByIdResult>
{
    private readonly IDiscussionRepository _repository;
    private readonly IFilesService _filesService;

    public GetDiscussionByIdHandler(IDiscussionRepository repository, IFilesService filesService)
    {
        _repository = repository;
        _filesService = filesService;
    }

    public async Task<GetDiscussionByIdResult> Handle(GetDiscussionByIdQuery query, CancellationToken cancellationToken)
    {
        var discussion = await _repository.GetByIdAsync(query.Id);

        // Kiểm tra nếu discussion không tồn tại
        if (discussion == null)
        {
            // Trả về kết quả với giá trị null hoặc xử lý lỗi tùy theo yêu cầu
            return new GetDiscussionByIdResult(null);
        }

        var s3Object = await _filesService.GetFileAsync(StorageConstants.BUCKET, discussion.ImageUrl, 60);

        var discussionDto = discussion?.ToDiscussionDto(s3Object.PresignedUrl!);

        return new GetDiscussionByIdResult(discussionDto);

    }
}
