namespace Learning.Application.Models.Chapters.Commands.SwapChapter;

public class SwapChapterHandler(IChapterRepository chapterRepository, ICourseRepository courseRepository)
    : ICommandHandler<SwapChapterCommand, SwapChapterResult> {

    public async Task<SwapChapterResult> Handle(SwapChapterCommand request, CancellationToken cancellationToken) {
        var chapter1 = await chapterRepository.GetByIdAsync(request.ChapterId1);
        if (chapter1 == null) {
            throw new NotFoundException(nameof(Chapter), request.ChapterId1);
        }

        var chapter2 = await chapterRepository.GetByIdAsync(request.ChapterId2);
        if (chapter2 == null) {
            throw new NotFoundException(nameof(Chapter), request.ChapterId2);
        }

        var course = await courseRepository.GetByIdAsync(chapter1.CourseId.Value);
        if (course == null || !chapter2.CourseId.Equals(course.Id)) {
            throw new ConflictException("Chapters do not belong to the same course.");
        }

        SwapChapterOrder(course, chapter1, chapter2);

        await chapterRepository.UpdateAsync(chapter1);
        await chapterRepository.UpdateAsync(chapter2);
        await chapterRepository.SaveChangesAsync(cancellationToken);

        return new SwapChapterResult(chapter1.OrderIndex, chapter2.OrderIndex);
    }

    private static void SwapChapterOrder(Course course, Chapter chapter1, Chapter chapter2) {
        var tmp = chapter1.OrderIndex;
        course.UpdateOrderIndexChapter(chapter1, chapter2.OrderIndex);
        course.UpdateOrderIndexChapter(chapter2, tmp);
    }
}
