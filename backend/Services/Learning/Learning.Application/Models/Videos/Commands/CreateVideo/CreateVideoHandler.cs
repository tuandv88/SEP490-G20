using BuidingBlocks.Storage.Interfaces;
using Learning.Application.Data.Repositories;
using Learning.Domain.ValueObjects;
using Microsoft.AspNetCore.Http;

namespace Learning.Application.Models.Videos.Commands.CreateVideo;
public class CreateVideoHandler(IVideoRepository repository, IFilesService storage) : ICommandHandler<CreateVideoCommand, CreateVideoResult> {
    public async Task<CreateVideoResult> Handle(CreateVideoCommand request, CancellationToken cancellationToken) {

        var video = await CreateNewVideoAsync(request.File);
        await repository.AddAsync(video);

        return new CreateVideoResult(video.Id.Value);
    }
    private async Task<Video> CreateNewVideoAsync(IFormFile file) {
        var fileName = file.FileName;
        var prefix = StorageConstants.VIDEO_PATH;
        var bucket = StorageConstants.BUCKET;

        var storedFileName = await storage.UploadFileAsync(file, bucket, prefix);

        var format = file.ContentType;
        var fileSize = file.Length;
        var duration = await GetVideoDuration(file.OpenReadStream());

        var video = new Video {
            Id = VideoId.Of(Guid.NewGuid()),
            FileName = fileName,
            Url = $"{prefix}{storedFileName}",
            Format = format,
            FileSize = fileSize,
            Duration = duration,
            IsActive = true,
        };

        return video;
        // Lưu thông tin video vào repository
    }
    private async Task<double> GetVideoDuration(Stream videoStream) {
        // Thực hiện logic để lấy độ dài video
        // Có thể sử dụng thư viện như NAudio hoặc MediaInfo để lấy thông tin này
        // Ví dụ trả về 0 ở đây
        return await Task.FromResult(0.0);
    }

}

