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

        string? imageUrl = null;

        // Kiểm tra nếu d.ImageUrl không phải null hoặc rỗng
        if (!string.IsNullOrEmpty(discussion.ImageUrl))
        {
            // Nếu có ImageUrl, gọi GetFileAsync để lấy URL ảnh
            var fileInfo = await _filesService.GetFileAsync(StorageConstants.BUCKET, discussion.ImageUrl, 60);
            imageUrl = fileInfo.PresignedUrl;  // Lưu URL ảnh vào biến imageUrl
        }


        var discussionDto = discussion?.ToDiscussionDto(imageUrl);

        return new GetDiscussionByIdResult(discussionDto);

    }
}
