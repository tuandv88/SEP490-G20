namespace Learning.Application.Models.Lectures.Dtos;
public record LectureDto(
    Guid Id,
    string Title,
    string Summary,
    double TimeEstimation,
    string LectureType,
    int OrderIndex,
    int Point,
    bool IsFree
);

