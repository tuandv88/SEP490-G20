using Learning.Application.Models.Lectures.Dtos;

namespace Learning.Application.Models.Lectures.Commands.CreateLecture;
public class CreateLectureHandler(IChapterRepository chapterRepository, ILectureRepository lectureRepository) : ICommandHandler<CreateLectureCommand, CreateLectureResult> {
    public async Task<CreateLectureResult> Handle(CreateLectureCommand request, CancellationToken cancellationToken) {
        var chapter = await chapterRepository.GetByIdDetailAsync(request.ChapterId);
        if (chapter == null) {
            throw new NotFoundException("Chapter", request.ChapterId);
        }
        var lecture = await CreateNewLecture(chapter, request.CreateLectureDto);

        await lectureRepository.AddAsync(lecture);
        await lectureRepository.SaveChangesAsync(cancellationToken);

        return new CreateLectureResult(lecture.Id.Value);
    }
    private async Task<Lecture> CreateNewLecture(Chapter chapter, CreateLectureDto createLectureDto) {
        var lectureType = Enum.TryParse<LectureType>(createLectureDto.LectureType, out var status)
        ? status
        : throw new ArgumentOutOfRangeException(nameof(createLectureDto.LectureType), $"Value '{createLectureDto.LectureType}' is not valid for LectureType.");

        var lecture = Lecture.Create(
            lectureId: LectureId.Of(Guid.NewGuid()),
            chapterId: chapter.Id,
            title: createLectureDto.Title,
            summary: createLectureDto.Summary,
            timeEstimation: createLectureDto.TimeEstimation,
            lectureType: lectureType,
            orderIndex: (await lectureRepository.CountByChapterAsync(chapter.Id.Value)) + 1,
            point: createLectureDto.Point,
            isFree: createLectureDto.IsFree
            );
        chapter.AddLecture(lecture);
        return lecture;
    }
}



