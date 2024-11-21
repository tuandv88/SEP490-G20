using Learning.Application.Interfaces;
using BuildingBlocks.Exceptions;
namespace Learning.Infrastructure.Services;
public class QuizSubmissionStateService(IQuizSubmissionRepository quizSubmissionRepository, IQuizRepository quizRepository) : IQuizSubmissionStateService {
    public async Task ChangeStatus(QuizSubmissionId Id, QuizSubmissionStatus status) {
        var quizSubmission = await quizSubmissionRepository.GetByIdAsync(Id.Value);
        if(quizSubmission == null) {
            throw new NotFoundException(nameof(QuizSubmission), Id.Value);
        }
        
        quizSubmission.UpdateStatus(status);
        await quizSubmissionRepository.UpdateAsync(quizSubmission);
        await quizSubmissionRepository.SaveChangesAsync();
    }
}

