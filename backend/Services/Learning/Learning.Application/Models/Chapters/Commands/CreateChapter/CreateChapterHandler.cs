using Learning.Application.Models.Chapters.Dtos;

namespace Learning.Application.Models.Chapters.Commands.CreateChapter;
public class CreateChapterHandler(ICourseRepository courseRepository, IChapterRepository chapterRepository) : ICommandHandler<CreateChapterCommand, CreateChapterResult> {
    public async Task<CreateChapterResult> Handle(CreateChapterCommand request, CancellationToken cancellationToken) {
     
        var course = await courseRepository.GetByIdAsync(request.CourseId);
        if (course == null) {
            throw new NotFoundException("Course", request.CourseId);
        }
        var chapter = await CreateNewChapter(course, request.CreateChapterDto);
        await chapterRepository.AddAsync(chapter);
        await chapterRepository.SaveChangesAsync(cancellationToken);

        return new CreateChapterResult(chapter.Id.Value);
    }

    private async Task<Chapter> CreateNewChapter(Course course, CreateChapterDto createChapterDto) {
        var chapter = Chapter.Create(
            courseId: course.Id,
            chapterId: ChapterId.Of(Guid.NewGuid()),
            title: createChapterDto.Title,
            description: createChapterDto.Description,
            timeEstimation: createChapterDto.TimeEstimation,
            orderIndex: (await chapterRepository.CountByCourseAsync(course.Id.Value)) + 1
            );
        course.AddChapter(chapter);
        return chapter;
    }
}

