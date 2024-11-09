using Learning.Application.Data.Repositories;
using Learning.Application.Models.Chapters.Dtos;
using Learning.Domain.ValueObjects;

namespace Learning.Application.Models.Chapters.Commands.CreateChapter;
public class CreateChapterHandler(ICourseRepository courseRepository, IChapterRepository chapterRepository) : ICommandHandler<CreateChapterCommand, CreateChapterResult> {
    public async Task<CreateChapterResult> Handle(CreateChapterCommand request, CancellationToken cancellationToken) {
     
        var course = await courseRepository.GetByIdAsync(request.CourseId);
        if (course == null) {
            throw new NotFoundException("Course", request.CourseId);
        }
        var chapter = CreateNewChapter(course, request.CreateChapterDto);
        await chapterRepository.AddAsync(chapter);
        await chapterRepository.SaveChangesAsync(cancellationToken);

        return new CreateChapterResult(chapter.Id.Value);
    }

    private Chapter CreateNewChapter(Course course, CreateChapterDto createChapterDto) {
        var chapter = Chapter.Create(
            courseId: course.Id,
            chapterId: ChapterId.Of(Guid.NewGuid()),
            title: createChapterDto.Title,
            description: createChapterDto.Description,
            timeEstimation: createChapterDto.TimeEstimation,
            orderIndex: createChapterDto.OrderIndex
            );
        course.AddChapter(chapter);
        return chapter;
    }
}

