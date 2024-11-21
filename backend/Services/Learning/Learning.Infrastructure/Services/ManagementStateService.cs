using Learning.Application.Interfaces;
using BuildingBlocks.Exceptions;
namespace Learning.Infrastructure.Services;
public class ManagementStateService(IQuizSubmissionRepository quizSubmissionRepository) : IManagementStateService {
    public async Task ChangeQuizSubmissionStatus(QuizSubmissionId Id, QuizSubmissionStatus status) {
        var quizSubmission = await quizSubmissionRepository.GetByIdAsync(Id.Value);
        if(quizSubmission == null) {
            throw new NotFoundException(nameof(QuizSubmission), Id.Value);
        }
        
        quizSubmission.UpdateStatus(status);
        await quizSubmissionRepository.UpdateAsync(quizSubmission);
        await quizSubmissionRepository.SaveChangesAsync();
    }
}

