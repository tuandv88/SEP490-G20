using Learning.Application.Models.Courses.Dtos;
namespace Learning.Application.Models.Courses.Commands.CreateCourse;
public class CreateCourseHandler(ICourseRepository repository, IFilesService filesService, IBase64Converter base64Converter) : ICommandHandler<CreateCourseCommand, CreateCourseResult>
{
    public async Task<CreateCourseResult> Handle(CreateCourseCommand request, CancellationToken cancellationToken)
    {

        var course = await CreateNewCourse(request.CreateCourseDto);
        await repository.AddAsync(course);
        await repository.SaveChangesAsync(cancellationToken);

        return new CreateCourseResult(course.Id.Value);
    }

    private async Task<Course> CreateNewCourse(CreateCourseDto createCourseDto)
    {
        var courseLevel = Enum.TryParse<CourseLevel>(createCourseDto.CourseLevel, out var level)
            ? level
            : throw new ArgumentOutOfRangeException(nameof(createCourseDto.CourseLevel), $"Value '{createCourseDto.CourseLevel}' is not valid for CourseLevel.");

        var bucket = StorageConstants.BUCKET;
        var prefix = StorageConstants.IMAGE_PATH;
        var originFileName = createCourseDto.Image.FileName;
        var base64Image = createCourseDto.Image.Base64Image;
        var contentType = createCourseDto.Image.ContentType;

        var fileName = await filesService.UploadFileAsync(base64Converter.ConvertToMemoryStream(base64Image), originFileName, contentType, bucket, prefix);
        var fileUrl = $"{prefix}/{fileName}";

        return Course.Create(
            courseId: CourseId.Of(Guid.NewGuid()),
            title: createCourseDto.Title,
            description: createCourseDto.Description,
            headline: createCourseDto.Headline,
            courseStatus: CourseStatus.Draft,
            prerequisites: createCourseDto.Prerequisites,
            objectives: createCourseDto.Objectives,
            targetAudiences: createCourseDto.TargetAudiences,
            imageUrl: fileUrl,
            orderIndex: (await repository.CountByLevelAsync(courseLevel)) + 1,
            courseLevel: courseLevel,
            price: createCourseDto.Price
        );
    }
}

