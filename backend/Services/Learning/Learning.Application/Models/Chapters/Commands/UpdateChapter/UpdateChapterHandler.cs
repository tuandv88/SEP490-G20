using Learning.Application.Models.Chapters.Dtos;

namespace Learning.Application.Models.Chapters.Commands.UpdateChapter;
public class UpdateChapterHandler(ICourseRepository courseRepository, IChapterRepository chapterRepository) : ICommandHandler<UpdateChapterCommand, UpdateChapterResult> {
    public async Task<UpdateChapterResult> Handle(UpdateChapterCommand request, CancellationToken cancellationToken) {
        var course = await courseRepository.GetByIdDetailAsync(request.CourseId);
        if (course == null) {
            throw new NotFoundException("Course", request.CourseId);
        }

        var chapter = UpdateChapter(course, request.ChapterId, request.UpdateChapterDto);
        await chapterRepository.UpdateAsync(chapter);
        await chapterRepository.SaveChangesAsync(cancellationToken);

        return new UpdateChapterResult(true);
    }
     
    private Chapter UpdateChapter(Course course, Guid chapterId, UpdateChapterDto updateChapterDto) {
        var chapter = course.UpdateChapter(
            chapterId: ChapterId.Of(chapterId),
            title: updateChapterDto.Title,
            description: updateChapterDto.Description,
            timeEstimation: updateChapterDto.TimeEstimation,
            isActive: updateChapterDto.IsActive);
        return chapter;
    }
}

