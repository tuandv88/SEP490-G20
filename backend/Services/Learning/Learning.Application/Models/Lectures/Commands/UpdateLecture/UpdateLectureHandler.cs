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

        var lectureType = Enum.TryParse<LectureType>(lectureDto.LectureType, out var status)
            ? status
            : throw new ArgumentOutOfRangeException(nameof(lectureDto.LectureType), $"Value '{lectureDto.LectureType}' is not valid for LectureType.");

        var lecture = chapter.UpdateLecture(
            lectureId: LectureId.Of(lectureId),
            title: lectureDto.Title,
            summary: lectureDto.Summary,
            timeEstimation: lectureDto.TimeEstimation,
            lectureType: lectureType,
            point: lectureDto.Point,
            isFree: lectureDto.IsFree
        );
        return lecture;
    }

}

