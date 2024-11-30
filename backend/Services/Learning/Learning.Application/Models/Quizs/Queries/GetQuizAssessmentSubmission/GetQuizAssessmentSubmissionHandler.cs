
using Learning.Application.Models.Quizs.Dtos;

namespace Learning.Application.Models.Quizs.Queries.GetQuizAssessmentSubmission;
public class GetQuizAssessmentSubmissionHandler(IQuizRepository quizRepository, IUserContextService userContextService) : IQueryHandler<GetQuizAssessmentSubmissionQuery, GetQuizAssessmentSubmissionResult> {
    public Task<GetQuizAssessmentSubmissionResult> Handle(GetQuizAssessmentSubmissionQuery request, CancellationToken cancellationToken) {
        var userId = userContextService.User.Id;
        var quizCards = quizRepository.GetAllAsQueryable()
            .Include(q => q.QuizSubmissions)
            .Where(q => q.QuizSubmissions.Any(qs => qs.UserId.Equals(UserId.Of(userId))) && q.QuizType == QuizType.ASSESSMENT) // Lọc các quiz có submission của user
            .Select(q => new {
                QuizId = q.Id.Value,
                q.Title,
                q.IsActive,
                Submissions = q.QuizSubmissions
                    .Where(qs => qs.UserId.Equals(UserId.Of(userId)))
                    .OrderBy(qs => qs.SubmissionDate)
                    .Select(qs => new {
                        SubmissionId = qs.Id.Value,
                        qs.SubmissionDate
                    })
                    .ToList()
            })
            .ToList();

        var result = quizCards.Select(q => new QuizSubmissionAssessmentDto(
                q.QuizId,
                q.Title,
                q.IsActive,
                q.Submissions.Select(qz => new AssessmentDto(
                    qz.SubmissionId,
                    qz.SubmissionDate
                    )).ToList()
            )).ToList();

        return Task.FromResult(new GetQuizAssessmentSubmissionResult(result));
    }
}

