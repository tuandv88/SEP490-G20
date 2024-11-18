namespace Learning.Application.Models.Lectures.Commands.SwapLecture;
public class SwapLectureHandler(IChapterRepository chapterRepository, ILectureRepository lectureRepository) : ICommandHandler<SwapLectureCommand, SwapLectureResult> {
    public async Task<SwapLectureResult> Handle(SwapLectureCommand request, CancellationToken cancellationToken) {
        var lecture1 = await lectureRepository.GetByIdAsync(request.LectureId1);
        if(lecture1 == null) { 
            throw new NotFoundException(nameof(Lecture), request.LectureId1);
        }
        var lecture2 = await lectureRepository.GetByIdAsync(request.LectureId2);
        if(lecture2 == null) {
            throw new NotFoundException(nameof(Lecture), request.LectureId2);
        }
        var chapter = await chapterRepository.GetByIdAsync(lecture1.ChapterId.Value);
        if (chapter == null || !lecture2.ChapterId.Equals(chapter.Id)) {
            throw new ConflictException("Lectures do not belong to the same course.");
        }
        SwapLectureOrder(chapter, lecture1, lecture2);

        await lectureRepository.UpdateAsync(lecture1);
        await lectureRepository.UpdateAsync(lecture2);
        await lectureRepository.SaveChangesAsync(cancellationToken);

        return new SwapLectureResult(lecture1.OrderIndex, lecture2.OrderIndex);
    }

    private void SwapLectureOrder(Chapter chapter, Lecture lecture1, Lecture lecture2) {
        var tmp = lecture1.OrderIndex;
        chapter.UpdateOrderIndexLecture(lecture1, lecture2.OrderIndex);
        chapter.UpdateOrderIndexLecture(lecture2, tmp);
    }
}

