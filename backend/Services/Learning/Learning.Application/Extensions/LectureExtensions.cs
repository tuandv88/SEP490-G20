using Learning.Application.Models.Files.Dtos;
using Learning.Application.Models.Lectures.Dtos;
using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.Quizs.Dtos;

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
    public static LectureDetailsDto ToLectureDetailDto(this Lecture lecture, ProblemDto? problem, QuizDto? quiz) {
        return new LectureDetailsDto(
            Id: lecture.Id.Value,
            Title: lecture.Title,
            Summary: lecture.Summary,
            TimeEstimation: lecture.TimeEstimation,
            LectureType: lecture.LectureType.ToString(),
            OrderIndex: lecture.OrderIndex,
            Point: lecture.Point,
            IsFree: lecture.IsFree,
            Problem: problem,
            Quiz: quiz,
            Files: lecture.Files.Select(f => new FileDto(
                FileId: f.Id.Value, 
                FileName: f.FileName, 
                FileSize: f.FileSize,
                FileType: f.FileType.ToString(), 
                Duration: f.Duration)).ToList()
            );
    }
}

