namespace Learning.Application.Models.Lectures.Dtos;
public record CreateLectureDto(
    string Title,
    string Summary,
    double TimeEstimation,
    string LectureType,
    int Point,
    bool IsFree = false
);

