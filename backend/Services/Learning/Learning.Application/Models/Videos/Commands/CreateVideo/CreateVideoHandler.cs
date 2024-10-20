using BuidingBlocks.Storage.Interfaces;
using Learning.Application.Data.Repositories;
using Learning.Application.Models.Videos.Dtos;
using Learning.Domain.ValueObjects;
using Microsoft.AspNetCore.Http;

namespace Learning.Application.Models.Videos.Commands.CreateVideo;
public class CreateVideoHandler(IVideoRepository repository, IFilesService storage) : ICommandHandler<CreateVideoCommand, CreateVideoResult> {
    public async Task<CreateVideoResult> Handle(CreateVideoCommand request, CancellationToken cancellationToken) {

        var video = await CreateNewVideoAsync(request.File, request.Duration);

        await repository.AddAsync(video);
        await repository.SaveChangesAsync(cancellationToken);

        return new CreateVideoResult(video.Id.Value);
    }
    private async Task<Video> CreateNewVideoAsync(IFormFile file, double duration) {
        var fileName = file.FileName;
        var prefix = StorageConstants.VIDEO_PATH;
        var bucket = StorageConstants.BUCKET;

        var storedFileName = await storage.UploadFileAsync(file, bucket, prefix);

        var format = file.ContentType;
        var fileSize = file.Length;

        var video = new Video {
            Id = VideoId.Of(Guid.NewGuid()),
            FileName = fileName,
            Url = $"{prefix}{storedFileName}",
            Format = format,
            FileSize = fileSize,
            Duration = duration,
            IsActive = true,
            //LessonId = 
        };

        return video;
    }

}

