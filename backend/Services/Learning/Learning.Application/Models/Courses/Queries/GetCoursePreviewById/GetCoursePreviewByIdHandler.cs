using Learning.Application.Models.Courses.Queries.GetCoursePreviewById;
using Learning.Application.Models.Lectures.Dtos;

namespace Learning.Application.Models.Courses.Queries;
public class GetCoursePreviewByIdHandler(ICourseRepository repository, IFilesService filesService, IUserContextService userContext, IFileRepository fileRepository)
    : IQueryHandler<GetCoursePreviewByIdQuery, GetCoursePreviewByIdResult> {
    public async Task<GetCoursePreviewByIdResult> Handle(GetCoursePreviewByIdQuery request, CancellationToken cancellationToken) {
        var userRole = userContext.User?.Role;

        var course = await repository.GetByIdDetailAsync(request.Id);
        if (course == null) {
            throw new NotFoundException("Course", request.Id);
        }

        var isAdmin = userRole == PoliciesType.Administrator;
        var isPublished = course.CourseStatus == CourseStatus.Published;

        if (!isAdmin && !isPublished) {
            throw new NotFoundException("Course", request.Id);
        }
        var s3Object = await filesService.GetFileAsync(StorageConstants.BUCKET, course.ImageUrl, 60);

        var chapterPreview = course.Chapters
            .OrderBy(c => c.OrderIndex)
            .Select(c => {
                var lectures = c.Lectures
                    .OrderBy(l => l.OrderIndex)
                    .Select(c => {
                        var file = fileRepository.GetVideoByLectureId(c.Id);
                        LecturePreviewDto lecture = new LecturePreviewDto() {
                            Id = c.Id.Value,
                            Title = c.Title,
                            OrderIndex = c.OrderIndex,
                            IsFree = c.IsFree
                        };
                        if (lecture.IsFree) {
                            lecture.Summary = c.Summary;
                            if (file != null) {
                                var video = filesService.GetFileAsync(StorageConstants.BUCKET, file.Url, 24 * 60).Result;
                                lecture.VideoUrl = video.PresignedUrl;
                            }
                        }
                        return lecture;
                    }).ToList();
                return c.ToChapterPreviewDto(lectures);
            }).ToList();

        return new GetCoursePreviewByIdResult(course.ToCoursePreviewDto(s3Object.PresignedUrl!, chapterPreview));
    }
}

