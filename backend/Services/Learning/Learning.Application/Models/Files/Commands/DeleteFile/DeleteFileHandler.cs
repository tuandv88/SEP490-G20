
namespace Learning.Application.Models.Files.Commands.DeleteFile;
public class DeleteFileHandler(ILectureRepository lectureRepository, IFileRepository fileRepository, IFilesService filesService) : ICommandHandler<DeleteFileCommand, Unit> {
    public async Task<Unit> Handle(DeleteFileCommand request, CancellationToken cancellationToken) {
        var lecture = await lectureRepository.GetLectureByIdDetail(request.LectureId);
        if (lecture == null) {
            throw new NotFoundException(nameof(Lecture), request.LectureId);
        }

        var file = lecture.Files.FirstOrDefault(f => f.Id.Equals(FileId.Of(request.FileId)));
        if(file == null) {
            throw new NotFoundException(nameof(Domain.Models.File), request.FileId);
        }
        var bucket = StorageConstants.BUCKET;
        await filesService.DeleteFileAsync(bucket, file.Url);
        lecture.DeleteFile(file);
        await fileRepository.DeleteAsync(file);
        await fileRepository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}

