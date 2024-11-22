using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Extensions;
public static class LectureProgressExtensions {
    public static CourseProgressDto ToCourseProgressDto(this LectureProgress lectureProgress) {
        return new CourseProgressDto(
                lectureProgress.LectureId.Value,
                lectureProgress.CompletionDate,
                lectureProgress.IsCurrent,
                lectureProgress.Duration
            );
    }
}

