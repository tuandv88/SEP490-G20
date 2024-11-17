namespace Learning.Application.Models.Files.Queries.GetFileById;

public class GetFileByIdHandler(IFileRepository fileRepository, ILectureRepository lectureRepository, IFilesService filesService) 
    : IQueryHandler<GetFileByIdQuery, GetFileByIdResult> {
    public async Task<GetFileByIdResult> Handle(GetFileByIdQuery request, CancellationToken cancellationToken) {
        var lecture = await lectureRepository.GetByIdAsync(request.LectureId);
        if(lecture == null) {
            throw new NotFoundException("Lecture", request.LectureId);
        }
        var file = await fileRepository.GetByIdAsync(request.FileId);
        if(file == null) {
            throw new NotFoundException("File", request.FileId);
        }
        if(file.LectureId.Value != lecture.Id.Value) {
            throw new ConflictException($"The file with ID {request.FileId} is associated with a different lecture.");
        }

        var s3Object = await filesService.GetFileAsync(StorageConstants.BUCKET, file.Url);
        return new GetFileByIdResult(s3Object.PresignedUrl!);
    }
}

