using Learning.Application.Models.Files.Dtos;

namespace Learning.Application.Models.Files.Commands.CreateFile;
public class CreateFileHandler(IFilesService filesService, IFileRepository fileRepository, ILectureRepository lectureRepository) : ICommandHandler<CreateFileCommand, CreateFileResult> {
    public async Task<CreateFileResult> Handle(CreateFileCommand request, CancellationToken cancellationToken) {
        var lecture = await lectureRepository.GetByIdAsync(request.LectureId);

        if(lecture == null) {
            throw new NotFoundException("Lecture", request.LectureId);
        }
        var file = await CreateNewFileAsync(lecture, request.CreateFileDto);

        await fileRepository.AddAsync(file);
        await fileRepository.SaveChangesAsync(cancellationToken);

        return new CreateFileResult(file.Id.Value);
    }
    private async Task<Domain.Models.File> CreateNewFileAsync(Lecture lecture, CreateFileDto createFileDto) {
        if (!Enum.TryParse(typeof(FileType), createFileDto.FileType, true, out var parsedFileType)) {
            throw new ArgumentException("Invalid file type provided.");
        }
        var bucket = StorageConstants.BUCKET;
        string prefix;
        switch ((FileType)parsedFileType) {
            case FileType.VIDEO:
                prefix = StorageConstants.VIDEO_PATH;
                break;
            case FileType.DOCUMENT:
                prefix = StorageConstants.DOCUMENT_PATH;
                break;
            case FileType.IMAGE:
                prefix = StorageConstants.IMAGE_PATH;
                break;
            default:
                throw new ArgumentException("Invalid file type provided.");
        }

        var fileName = await filesService.UploadFileAsync(createFileDto.File, bucket, prefix);
        var fileUrl = $"{prefix}/{fileName}";

        var file = Domain.Models.File.Create(
            id: FileId.Of(Guid.NewGuid()),
            lectureId: lecture.Id,
            fileName: createFileDto.File.FileName,
            url: fileUrl,
            format: Path.GetExtension(createFileDto.File.FileName),
            fileSize: createFileDto.File.Length,
            isActive: true,
            fileType: (FileType)parsedFileType,
            duration: (FileType)parsedFileType == FileType.VIDEO ? Convert.ToDouble(createFileDto.Duration) : null
        );
        lecture.AddFile(file);
        return file;

    }
}

