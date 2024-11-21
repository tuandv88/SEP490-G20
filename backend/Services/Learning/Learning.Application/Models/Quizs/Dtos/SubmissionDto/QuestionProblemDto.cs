using Learning.Application.Models.Submissions.Dtos;

namespace Learning.Application.Models.Quizs.Dtos.SubmissionDto;
public record QuestionProblemDto(
    Guid ProblemId,
    SubmissionCodeDto Submission
);

