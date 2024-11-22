using Learning.Application.Models.Chapters.Dtos;
using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Extensions;
public static class CourseExtensions {
    public static async Task<List<CourseDto>> ToCourseDtoListAsync(this List<Course> courses, IFilesService filesService) {
        var tasks = courses.Select(async c => {
            var imageUrl = await filesService.GetFileAsync(StorageConstants.BUCKET, c.ImageUrl, 60);
            return c.ToCourseDto(imageUrl.PresignedUrl!);
        });

        var courseDtos = await Task.WhenAll(tasks);
        return courseDtos.ToList();
    }

    public static CourseDto ToCourseDto(this Course course, string imageUrl) {
        return new CourseDto(
            Id: course.Id.Value,
            Title: course.Title,
            Description: course.Description,
            Headline: course.Headline,
            CourseStatus: course.CourseStatus.ToString(),
            TimeEstimation: course.TimeEstimation,
            Prerequisites: course.Prerequisites,
            Objectives: course.Objectives,
            TargetAudiences: course.TargetAudiences,
            ScheduledPublishDate: course.ScheduledPublishDate,
            ImageUrl: imageUrl,
            OrderIndex: course.OrderIndex,
            CourseLevel: course.CourseLevel.ToString(),
            Price: course.Price
            );
    }
    public static CourseDetailsDto ToCourseDetailsDto(this Course course, string imageUrl) {
        var courseDetail = new CourseDetailsDto(
            CourseDto: course.ToCourseDto(imageUrl),
            ChapterDetailsDtos: course.Chapters
            .OrderBy(c => c.OrderIndex)
            .Select(c => c.ToChapterDetailDto()).ToList()
            );
        return courseDetail;
    }

    public static UserEnrollmentDto ToUserEnrollmentDto(this UserCourse userCourse) {
        return new UserEnrollmentDto(
                userCourse.EnrollmentDate,
                userCourse.CompletionDate,
                userCourse.UserCourseStatus.ToString(),
                userCourse.Rating,
                userCourse.Feedback
            );
    }

    public static CoursePreviewDto ToCoursePreviewDto(this Course course, string imageUrl, List<ChapterPreviewDto> chapters) {
        return new CoursePreviewDto(
             Id: course.Id.Value,
            Title: course.Title,
            Description: course.Description,
            Headline: course.Headline,
            CourseStatus: course.CourseStatus.ToString(),
            TimeEstimation: course.TimeEstimation,
            Prerequisites: course.Prerequisites,
            Objectives: course.Objectives,
            TargetAudiences: course.TargetAudiences,
            ScheduledPublishDate: course.ScheduledPublishDate,
            ImageUrl: imageUrl,
            OrderIndex: course.OrderIndex,
            CourseLevel: course.CourseLevel.ToString(),
            Price: course.Price,
            Chapters: chapters
            );
    }
}

