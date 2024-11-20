using Community.Application.Interfaces;
using Community.Application.Models.Discussions.Dtos;

namespace Community.Application.Models.Discussions.Commands.UpdateImageDiscussion;

public class UpdateDiscussionImageHandler: ICommandHandler<UpdateDiscussionImageCommand, UpdateDiscussionImageResult>
{
    private readonly IDiscussionRepository _discussionRepository;
    private readonly IFilesService _filesService;
    private readonly IBase64Converter _base64Converter;

    private static string bucket = StorageConstants.BUCKET;
    public UpdateDiscussionImageHandler(IDiscussionRepository discussionRepository, IFilesService filesService, IBase64Converter base64Converter)
    {
        _discussionRepository = discussionRepository;
        _filesService = filesService;
        _base64Converter = base64Converter;
    }
    public async Task<UpdateDiscussionImageResult> Handle(UpdateDiscussionImageCommand request, CancellationToken cancellationToken)
    {
        var discussion = await _discussionRepository.GetByIdAsync(request.Id);
        if (discussion == null)
        {
            throw new NotFoundException("Discussion Not Found", request.Id);
        }

        var imageUrl = await UploadDiscussionImage(request.ImageDto);
        var oldImageUrl = discussion.ImageUrl;



        //Update image
        discussion.UpdateImage(imageUrl);
        discussion.DateUpdated = DateTime.Now;

        await _discussionRepository.UpdateAsync(discussion);
        await _discussionRepository.SaveChangesAsync(cancellationToken);

        await _filesService.DeleteFileAsync(bucket, oldImageUrl);

        //trả về siginkey
        var s3Object = await _filesService.GetFileAsync(bucket, imageUrl, 60);
        return new UpdateDiscussionImageResult(s3Object.PresignedUrl!);

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
