namespace Learning.Application.Models.Lectures.Dtos;
public record UpdateLectureDto(
    string Title,
    string Summary,
    double TimeEstimation,
    int Point,
    bool IsFree = false
);
