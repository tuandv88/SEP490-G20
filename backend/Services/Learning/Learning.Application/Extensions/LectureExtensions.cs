using Learning.Application.Models.Courses.Dtos;
using Learning.Application.Models.Lectures.Dtos;

namespace Learning.Application.Extensions;
public static class LectureExtensions {
    public static LectureDto ToLectureDto(this Lecture lecture) {
        return new LectureDto(
            Id: lecture.Id.Value,
            Title: lecture.Title,
            Summary: lecture.Summary,
            TimeEstimation: lecture.TimeEstimation,
            LectureType: lecture.LectureType.ToString(),
            OrderIndex: lecture.OrderIndex,
            Point: lecture.Point,
            IsFree: lecture.IsFree
            );
    }

    //public static List<LectureDto> ToLectureDtoList(this List<Lecture> lecture) {
    //    return lecture.Select(l => new LectureDto(
    //        Id: l.Id.Value,
    //        Title: l.Title,
    //        Summary: l.Summary,
    //        TimeEstimation: l.TimeEstimation,
    //        LectureType: l.LectureType.ToString(),
    //        OrderIndex: l.OrderIndex,
    //        Point: l.Point,
    //        IsFree: l.IsFree
    //        )).ToList();
    //}
}

