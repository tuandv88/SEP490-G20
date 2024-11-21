using Learning.Application.Models.Files.Dtos;
using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.Quizs.Dtos;

namespace Learning.Application.Models.Lectures.Dtos;
public record LectureDetailsDto(
    Guid Id,
    string Title,
    string Summary,
    double TimeEstimation,
    string LectureType,
    int OrderIndex,
    int Point,
    bool IsFree,
    ProblemDto? Problem,
    QuizDto? Quiz ,
    List<FileDto> Files
);
