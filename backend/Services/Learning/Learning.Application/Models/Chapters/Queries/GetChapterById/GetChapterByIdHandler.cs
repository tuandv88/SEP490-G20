
using Learning.Application.Data.Repositories;

namespace Learning.Application.Models.Chapters.Queries.GetChapterById;
public class GetChapterByIdHandler(ICourseRepository courseRepository, IChapterRepository chapterRepository)
     : IQueryHandler<GetChapterByIdQuery, GetChapterByIdResult> {
    public async Task<GetChapterByIdResult> Handle(GetChapterByIdQuery request, CancellationToken cancellationToken) {
        var course = await courseRepository.GetByIdAsync(request.CourseId);
        if (course == null) {
            throw new NotFoundException("Course", request.CourseId);
        }
        var chapter = await chapterRepository.GetByIdAsync(request.ChapterId);

        if (chapter == null) {
            throw new NotFoundException("Chapter", request.ChapterId);
        }
        if(chapter.CourseId.Value != request.CourseId) {
            throw new ConflictException($"The chapter with ID {request.ChapterId} is associated with a different course.");
        }
        return new GetChapterByIdResult(chapter.ToChapterDto());
    }
}

