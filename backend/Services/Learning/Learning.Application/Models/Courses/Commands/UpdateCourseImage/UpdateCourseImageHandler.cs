
using BuidingBlocks.Storage.Interfaces;
using BuidingBlocks.Storage.Services;
using Learning.Application.Data.Repositories;
using Learning.Application.Interfaces;
using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Commands.UpdateCourseImage;
public class UpdateCourseImageHandler(ICourseRepository repository, IFilesService filesService, IBase64Converter base64Converter) : ICommandHandler<UpdateCourseImageCommand, UpdateCourseImageResult> {
    private static string bucket = StorageConstants.BUCKET;
    public async Task<UpdateCourseImageResult> Handle(UpdateCourseImageCommand request, CancellationToken cancellationToken) {
        var course = await repository.GetByIdAsync(request.CourseId);
        if (course == null) {
            throw new NotFoundException("Course", request.CourseId);
        }

        var imageUrl = await UploadCourseImage(request.ImageDto);
        var oldImageUrl = course.ImageUrl;

        //Update image
        course.UpdateImage(imageUrl);
        await repository.UpdateAsync(course);
        await repository.SaveChangesAsync(cancellationToken);

        await filesService.DeleteFileAsync(bucket, oldImageUrl);

        //trả về siginkey
        var s3Object = await filesService.GetFileAsync(bucket, imageUrl, 60);
        return new UpdateCourseImageResult(s3Object.PresignedUrl!);

    }
    private async Task<string> UploadCourseImage(ImageDto imageDto) {
        var prefix = StorageConstants.IMAGE_PATH;
        var originFileName = imageDto.FileName;
        var base64Image = imageDto.Base64Image;
        var contentType = imageDto.ContentType;

        var fileName = await filesService.UploadFileAsync(base64Converter.ConvertToMemoryStream(base64Image), originFileName, contentType, bucket, prefix);
        
        var imageUrl = $"{prefix}/{fileName}";

        return imageUrl;
    }
}

