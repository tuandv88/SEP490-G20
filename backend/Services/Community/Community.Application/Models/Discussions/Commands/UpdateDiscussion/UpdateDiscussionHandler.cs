using Community.Application.Data.Repositories;
using Community.Application.Interfaces;
using Community.Application.Models.Discussions.Commands.UpdateImageDiscussion;
using Community.Application.Models.Discussions.Dtos;
using Community.Domain.Models;
using Community.Domain.ValueObjects;

namespace Community.Application.Models.Discussions.Commands.UpdateDiscussion;

public class UpdateDiscussionHandler : ICommandHandler<UpdateDiscussionCommand, UpdateDiscussionResult>
{
    private readonly IDiscussionRepository _discussionRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IUserContextService _userContextService;
    private readonly IFilesService _filesService;
    private readonly IBase64Converter _base64Converter;

    private static string bucket = StorageConstants.BUCKET;

    public UpdateDiscussionHandler(IDiscussionRepository discussionRepository, ICategoryRepository categoryRepository, IUserContextService userContextService, IFilesService iFilesService, IBase64Converter base64Converter)
    {
        _discussionRepository = discussionRepository;
        _categoryRepository = categoryRepository;
        _userContextService = userContextService;
        _filesService = iFilesService;
        _base64Converter = base64Converter;
    }

    public async Task<UpdateDiscussionResult> Handle(UpdateDiscussionCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.UpdateDiscussionDto.CategoryId);

        if (category == null)
        {
            throw new NotFoundException("Category not found.", request.UpdateDiscussionDto.CategoryId);
        }

        var discussion = await _discussionRepository.GetByIdAsync(request.UpdateDiscussionDto.Id);

        if (discussion == null)
        {
            throw new NotFoundException("Discussion not found.", request.UpdateDiscussionDto.Id);
        }

        string imageUrl;

        if (request.UpdateDiscussionDto.ImageDto != null)
        {
            imageUrl = await UploadDiscussionImage(request.UpdateDiscussionDto.ImageDto);

            var oldImageUrl = discussion.ImageUrl;

            if (!String.IsNullOrEmpty(oldImageUrl))
            {
                await _filesService.DeleteFileAsync(bucket, oldImageUrl);
            }
        }
        else
        {
            imageUrl = null;
        }

        UpdateDiscussionWithNewValues(discussion, request.UpdateDiscussionDto, imageUrl);

        discussion.DateUpdated = DateTime.UtcNow;

        await _discussionRepository.UpdateAsync(discussion);
        await _discussionRepository.SaveChangesAsync(cancellationToken);

        return new UpdateDiscussionResult(true);
    }

    private void UpdateDiscussionWithNewValues(Discussion discussion, UpdateDiscussionDto updateDiscussionDto, string? imageUrl)
    {
        // Dữ liệu test UserId
        //var userContextTest = "c3d4e5f6-a7b8-9012-3456-789abcdef010";

        //if (!Guid.TryParse(userContextTest, out var currentUserIdTest))
        //{
        //    throw new UnauthorizedAccessException("Invalid user ID.");
        //}

        //var userId = UserId.Of(currentUserIdTest);

        //Lấy UserId từ UserContextService
        var currentUserId = _userContextService.User.Id;

        if (currentUserId == null)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var userId = UserId.Of(currentUserId);

        var categoryId = CategoryId.Of(updateDiscussionDto.CategoryId);

        if(imageUrl == null)
        {
            imageUrl = discussion.ImageUrl ?? string.Empty;
        }

        discussion.Update(
            userId: userId,
            categoryId: categoryId,
            title: updateDiscussionDto.Title,
            description: updateDiscussionDto.Description,
            isActive: false,
            tags: updateDiscussionDto.Tags,
            closed: updateDiscussionDto.Closed,
            pinned: updateDiscussionDto.Pinned,
            viewCount: updateDiscussionDto.ViewCount,
            notificationsEnabled: updateDiscussionDto.EnableNotification,
            urlImage: imageUrl
        );
    }
    private async Task<string> UploadDiscussionImage(ImageDto imageDto)
    {
        var prefix = StorageConstants.IMAGE_COMMUNITY_PATH;
        var originFileName = imageDto.FileName;
        var base64Image = imageDto.Base64Image;
        var contentType = imageDto.ContentType;

        var fileName = await _filesService.UploadFileAsync(_base64Converter.ConvertToMemoryStream(base64Image), originFileName, contentType, bucket, prefix);

        var imageUrl = $"{prefix}/{fileName}";

        return imageUrl;
    }
}
