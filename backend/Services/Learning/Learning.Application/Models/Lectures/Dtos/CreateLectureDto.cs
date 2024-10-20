namespace Learning.Application.Models.Lectures.Dtos;
public record CreateLectureDto(
    Guid? LessonId,
    Guid? ProblemId,
    Guid? QuizId,
    string Title,
    string Summary,
    double TimeEstimation,
    string LectureType,
    int OrderIndex,
    int Point,
    bool IsFree
    );

