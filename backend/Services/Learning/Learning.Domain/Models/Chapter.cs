﻿
using Learning.Domain.Events;

namespace Learning.Domain.Models;
public class Chapter : Aggregate<ChapterId> {
    public List<Lecture> Lectures = new();
    public CourseId CourseId { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public double TimeEstimation { get; set; }
    public int OrderIndex { get; set; }
    public bool IsActive { get; set; } = true;

    public static Chapter Create(CourseId courseId, ChapterId chapterId, string title, string description, int orderIndex) {
        var chapter = new Chapter() {
            CourseId = courseId,
            Id = chapterId,
            Title = title,
            Description = description,
            OrderIndex = orderIndex
        };
        //Thêm event nếu cần
        return chapter;
    }

    public void AddLecture(Lecture lecture) {
        Lectures.Add(lecture);
        lecture.AddDomainEvent(new LectureUpdateTimeEstimationEvent(CourseId));
        TimeEstimation += lecture.TimeEstimation;
    }
    public Lecture UpdateLecture(LectureId lectureId, string title, string summary, double timeEstimation, int point, bool isFree) {
        var lecture = Lectures.FirstOrDefault(l => l.Id == lectureId);
        if (lecture == null) {
            throw new NotFoundException("Lecture not found", lectureId.Value);
        }
        if(lecture.TimeEstimation != timeEstimation) {
            lecture.AddDomainEvent(new LectureUpdateTimeEstimationEvent(CourseId));
            TimeEstimation = TimeEstimation - lecture.TimeEstimation + timeEstimation;
        }
        lecture.Title = title;
        lecture.Summary = summary;
        lecture.TimeEstimation = timeEstimation;
        lecture.Point = point;
        lecture.IsFree = isFree;
        return lecture;
    }

    public Lecture DeleteLecture(LectureId lectureId) {
        var lecture = Lectures.FirstOrDefault(l => l.Id == lectureId);
        if (lecture == null) {
            throw new NotFoundException("Lecture not found", lectureId.Value);
        }
        Lectures.Remove(lecture);
        lecture.AddDomainEvent(new LectureUpdateTimeEstimationEvent(CourseId));
        TimeEstimation -= lecture.TimeEstimation;
        return lecture;
    }
    public List<Lecture> DeleteLectures() {
        var deletedLectures = new List<Lecture>();
        Lectures.ForEach(lecture => {
            deletedLectures.Add(lecture);
            lecture.AddDomainEvent(new LectureUpdateTimeEstimationEvent(CourseId));
            TimeEstimation -= lecture.TimeEstimation;
        });
        Lectures.Clear();
        return deletedLectures;
    }

    public void UpdateOrderIndexLecture(Lecture lecture, int orderIndex) {
        lecture.OrderIndex = orderIndex;
    }
    public void ReorderLectures() {
        var orderedLectures = Lectures.OrderBy(l => l.OrderIndex).ToList();
        for (int i = 0; i < orderedLectures.Count; i++) {
            UpdateOrderIndexLecture(orderedLectures[i], i + 1);
        }
    }
}
