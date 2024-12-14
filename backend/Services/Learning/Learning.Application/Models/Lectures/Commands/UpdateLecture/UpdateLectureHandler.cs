using Learning.Application.Models.Lectures.Dtos;

namespace Learning.Application.Models.Lectures.Commands.UpdateLecture;
public class UpdateLectureHandler(IChapterRepository chapterRepository, ILectureRepository lectureRepository) : ICommandHandler<UpdateLectureCommand, UpdateLectureResult> {
    public async Task<UpdateLectureResult> Handle(UpdateLectureCommand request, CancellationToken cancellationToken) {
        var chapter = await chapterRepository.GetByIdDetailAsync(request.ChapterId);
        if (chapter == null) {
            throw new NotFoundException("Chapter", request.ChapterId);
        }
        var lecture = UpdateLecture(chapter, request.LectureId, request.Lecture);

        await lectureRepository.UpdateAsync(lecture);
        await lectureRepository.SaveChangesAsync(cancellationToken);

        return new UpdateLectureResult(true);
    }

    private Lecture UpdateLecture(Chapter chapter, Guid lectureId, UpdateLectureDto lectureDto) {
        var lecture = chapter.UpdateLecture(
            lectureId: LectureId.Of(lectureId),
            title: lectureDto.Title,
            summary: lectureDto.Summary,
            timeEstimation: lectureDto.TimeEstimation,
            point: lectureDto.Point,
            isFree: lectureDto.IsFree
        );
        return lecture;
    }

}

